
"use strict";
ucosmic.add_style = function(content, name){
    if(!ucosmic.store_styles_loaded){
        ucosmic.store_styles_loaded = [];
    }
    if(ucosmic.store_styles_loaded.indexOf(name) === -1){
        ucosmic.store_styles_loaded.push(name);
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = content;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}