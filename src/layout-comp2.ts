
// import { LitElement, html } from 'lit-element';
import { LitElement, html, property, customElement } from 'lit-element';
// https://stackoverflow.com/questions/58139661/lit-element-in-typescript-cannot-find-module
@customElement('layout-comp')
export class Layout extends LitElement {

  @property() name: object;

  constructor() {
    super();
    this.name = {}
    // this._shadowRoot = this.attachShadow({ mode: 'open' });
    // this._shadowRoot.appendChild(template2.content.cloneNode(true))
    // this.$button = this._shadowRoot.querySelector('button');
    // console.log(this.$button)
  }

  connectedCallback() {
        
  this.name=  fetch('/markdown', {
      headers: {
        Accept: 'text/html',
        'Content-Type': 'text/html',
      }
    })
      .then(res => { return res.text()})
      .then(data =>  console.log(data) )
      .catch((err) => {
    console.log('fetch error', err)
  })
  
  }

  render() {
    
    return html`
        <style>
          .container {
            display: grid;
            grid-template-columns: 10vw 90vw;
            grid-template-rows: 5vh 85vh 10vh;
          }

          .header {
            display: flex;
            justify-content: center;
            margin: 0 auto;
            grid-column: 1 / 2;
            z-index: 88;
            width: 100vw;
            align-items: center;
          }
          .sidebar {
            grid-column: 1
          }

          .content {
            overflow-y: scroll;
          }

          .footer {
            width: 100vw;
            grid-column: 1/2;
          }

          div {
            border: 1px solid black;
          }
        </style>
        <div> hello </div>

        <div class="container">

          <div class = "header">
            <slot name="header"></slot>
          </div>
          <div class="sidebar">
            <slot name ="sidebar"></slot>
          </div>
          <div class="content"> 
            <slot name = "content"></slot>
            <p id='text'>lkajdf;ladkjf;lafj<p>
          </div>

          <div class="footer">.footer</div>
        </div>
    `
  }
  // render
}
