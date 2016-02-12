<is_button>
    <style>
        is_button button{
            outline: none;
            -webkit-border-radius:6px;
            -moz-border-radius:6px;
            border-radius:6px;
            border: none;
            opacity: .8;
            transition: opacity .25s ease-in-out;
            -moz-transition: opacity .25s ease-in-out;
            -webkit-transition: opacity .25s ease-in-out;
        }
        is_button button:active{
            -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.11), 0 1px 3px 0 rgba(0, 0, 0, 0.11), 0 1px 1px -1px rgba(0, 0, 0, 0.1)!important;
            -moz-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.11), 0 1px 3px 0 rgba(0, 0, 0, 0.11), 0 1px 1px -1px rgba(0, 0, 0, 0.1)!important;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.11), 0 1px 3px 0 rgba(0, 0, 0, 0.11), 0 1px 1px -1px rgba(0, 0, 0, 0.1)!important;

        }
        is_button button:hover{
            cursor: pointer;
            -webkit-box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
            -moz-box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
            box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);

            opacity: 1;
        }
    </style>
    <div>
        <button type="{opts.type}"  riot-style="width:{opts.width}; height:{opts.height}; color: {opts.fore_color}; background-color:{opts.back_color}; font-size:{opts.font_size}; fill:{opts.fore_color}">
            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style="pointer-events: none; display: inline-block; width: 1.2em; height: 1.2em; ">
                <g>
                    <path d="{opts.path}">
                    </path>
                </g>
            </svg>
            <span><yield/>{opts.text}</span>
        </button>
    </div>
</is_button>