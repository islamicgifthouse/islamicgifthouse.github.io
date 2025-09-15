const currentScript = document.currentScript;
customElements.define('igh-sign', class IGHSign extends HTMLElement {
	static styleSheet = (() => {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(`
			:host {
				--tint: 0;
				-webkit-user-drag: none;
				background-color: hsl(var(--tint) 33% 13% / 90%);
				border: 1px solid hsl(var(--tint) 33% 33% / 25%);
				border-radius: .4em;
				box-shadow: inset 0 -.3em hsl(var(--tint) 40% 18% / 70%);
				color: hsl(var(--tint) 75% 85%);
				font-family: 'Segoe UI','Helvetica Neue',Helvetica,Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans',sans-serif;
				font-size: clamp(13px, 1.25vmax, 20px);
				left: .5em;
				line-height: 100%;
				opacity: .44;
				padding: 1em;
				padding-top: .5em;
				position: fixed;
				/* text-transform: uppercase; */
				transform-origin: left top;
				transition: background-color .3s, border-color .3s, box-shadow .3s, color .3s, scale .2s;
				top: .5em;
				user-select: none;
				will-change: background-color, border-color, box-shadow, color, scale;
			}

			@media (hover: none) {:host(:active) { scale: 1.3 }}
			@media (hover: hover) {:host(:hover) { scale: 1.2 }}
			:host([open]) {
				--tint: 140deg;
				opacity: .66;
			}

			:host::before {
				color: hsl(var(--tint) 30% 66% / 75%);
				content: "We are currently";
				display: block;
				font-size: .7em;
				margin-bottom: .33em;
				text-transform: none;
			}

			.status::before { content: "Closed" }
			.status::after { content: "مغلق" }
			:host([open]) .status::before { content: "Open" }
			:host([open]) .status::after { content: "مفتوح" }

			.divider {
				background-color: hsl(0 0 50% / 75%);
				display: inline-block;
				height: 1em;
				margin-block-start: auto;
				margin-block-end: auto;
				margin-inline-start: .5em;
				margin-inline-end: .5em;
				vertical-align: middle;
				width: 1px;
			}
		`);
		return sheet
	})();

	#timeout;
	constructor() {
		super();
		this.attachShadow({ mode: 'open' })
			.adoptedStyleSheets.push(this.constructor.styleSheet);

		const status = document.createElement('div');
		status.classList.add('status');
		const divider = document.createElement('span');
		divider.classList.add('divider');
		status.appendChild(divider);
		this.shadowRoot.appendChild(status)
	}

	#time() {
		const now = new Date
			, isFriday = 5 === now.getDay()
			, hour = now.getHours()
			, openingHour = isFriday ? 14 : 11
			, opened = hour >= openingHour
			, closingHour = 19
			, closed = hour >= closingHour;
		opened && !closed && this.toggleAttribute('open', true);
		const hoursRemaining = openingHour - (closed ? 24 - hour : hour) - 1
			, minutesRemaining = hoursRemaining * 60 + (59 - now.getMinutes());
		this.#timeout = setTimeout(() => {
			this.toggleAttribute('open');
			this.#time()
		}, minutesRemaining * 6e4)
	}

	connectedCallback() {
		this.#time()
	}

	disconnectedCallback() {
		clearTimeout(this.#timeout)
	}
});
currentScript.replaceWith(document.createElement('igh-sign'));