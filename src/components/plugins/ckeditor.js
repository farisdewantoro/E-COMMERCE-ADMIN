import React, { Component } from "react";
import { timingSafeEqual } from "crypto";

export default class CKEditor extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.elementName = "editor_" + this.props.name+this.props.id;
     
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        let configuration = {
            toolbar: "Basic",
        };
        window.CKEDITOR.config.width = "100%";
       
        window.CKEDITOR.replace(this.elementName, configuration);


        window.CKEDITOR.instances[this.elementName].on("change", function () {
            let data = window.CKEDITOR.instances[this.elementName].getData();

            this.props.onChange(data);
        }.bind(this));

    }
    render() {
        console.log(this.props);
        return (
            <textarea name={this.elementName} value={this.props.value} onChange={this.props.onChange}/>
        )
    }

  
}