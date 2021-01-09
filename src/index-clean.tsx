import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "./home-component";
import "./layout"
import { HelloComponent } from "./home-component";
import { Layout } from "./layout";
import useCustomElement from 'use-custom-element';
import BasicExample2 from './index'
import './layout.css'
 

export default function BasicExample(props: any) {
  return (
   
    <div className="container">

      <div className = "header">
        {/* <slot name="header"></slot> */}
      </div>
      <div className="sidebar">
        {props.children}
      </div>
      <div className="content"> 
        {/* <slot name = "content"></slot> */}
        <p id='text'>lkajdf;ladkjf;lafj</p>
      </div>

      <div className="footer">.footer</div>
    </div>
  
    
  )
    
}
