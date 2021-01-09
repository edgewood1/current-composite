

// import { LitElement, html } from 'lit-element';
import { LitElement, html, property, customElement } from 'lit-element';
// https://stackoverflow.com/questions/58139661/lit-element-in-typescript-cannot-find-module
@customElement('hello-component')
export class HelloComponent extends LitElement {
  @property() name = 'Luis';

  render() {
    return html`Hello, ${this.name}. Welcome to LitElement!`;
  }
}

// https://github.com/webcomponents/react-integration

// https://www.npmjs.com/package/webcomponents-in-react
// export class HelloComponent extends LitElement {
//   get properties() { // JavaScript way to define custom properties
//     return { name: { type: String, value: 'luis' } };
//   }

//   constructor() {
//     super();
//     // this.name = 'Luis'; // Default value goes here.
//   }
  
//   render() { // Defines a template to be "rendered" as part of the component.
//     return html`Hello ${this.name} . Welcome to LitElement!`;
//   }
// }

// // Register as a custom element named <hello-component>
// customElements.define('hello-component', HelloComponent);