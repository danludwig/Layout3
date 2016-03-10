<expander>
    <style scoped>
        #expander_title {
            cursor: pointer;
            /*background-color: transparent!important;*/
            /*mix-blend-mode: difference;*/
            padding: 5px;
            font-weight: bolder;
            font-size: 2em;
        }

        #expander_content {
            width: 100%;
            overflow: hidden;
        }
    </style>
    <div class="layout vertical" id="expander_container">
        <div id="expander_title" onclick="{toggle}" riot-style="background-color:{opts.background_color};"
             class="layout horizontal center start-justified {opts.background_class} {opts.foreground_class}" if="{opts.my_title}">
            <!--<span>{opts.my_title}</span>-->
            <div style="width: 0; overflow: visible;">
                <div style="height:1em; width:1em;">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                        <g class="style-scope iron-icon">
                            <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z" class="style-scope iron-icon">
                            </path>
                        </g>
                    </svg>
                </div>
            </div>
            <div class="layout horizontal center center-justified flex" style="margin: 0 1em;">
                <div id="expander_title_text"><echo_html id="echo_title" content="{opts.my_title}"></echo_html></div>
            </div>
        </div>
        <div id="expander_content" >
            <div id="inner_content" riot-style="background-color:{opts.background_color}; " class=" {opts.background_class}">
                <yield/>
            </div>
        </div>
    </div>
    <script type="es6">
        "use strict";
        let self = this;
        self.is_shown = self.opts.is_shown;
        self.expander_content.style.height = self.is_shown ? '' : '0px';

        ucosmic.load_tag('/components_riot/echo_html/echo_html.js', document.head);

        self.expand_collapse = (time_remaining, height_to, current_height, current_time, is_shown, expander_content) => {
            if (current_time <= time_remaining) {
                expander_content.style.height = current_height + 'px';
                current_time += 10;
                current_height = is_shown ? current_height - (current_height * (current_time / time_remaining)) : height_to * (current_time / time_remaining);
                setTimeout(function () {
                    self.expand_collapse(time_remaining, height_to, current_height, current_time, is_shown, expander_content);
                }, 10)
            } else {
                expander_content.style.height = is_shown ? 0 + 'px' : '';
                self.animation_done();
            }

        }


        self.animation_done = () =>{
            self.opts.animation_complete ? self.opts.animation_complete(self.is_shown) : null;
        }

        //I could not maintain state in this tag like I don't in menu_item_option and ddl's but not needed.
        self.toggle = (from_container) => {
            "use strict";
            if(!self.opts.toggle_expander_clicked || from_container === true){
                let expander_content = self.expander_content.style != undefined ? self.expander_content : self.expander_content[0];
                let inner_content_height = self.inner_content.offsetHeight != undefined ? self.inner_content.offsetHeight : self.inner_content[0].offsetHeight;
                if (self.is_shown) {
                    self.expand_collapse(parseInt(self.opts.time), inner_content_height, expander_content.offsetHeight, 1, self.is_shown, expander_content);
                } else {
                    self.expand_collapse(parseInt(self.opts.time), inner_content_height, 1, 1, self.is_shown, expander_content);
                }
                self.is_shown = self.is_shown ? false : true;
            }else{
                self.opts.toggle_expander_clicked(from_container);
            }
        }
        self.on('updated', () => {
            setTimeout(() => {
                self.echo_title._tag ? self.echo_title._tag.update_me_2(self.opts.my_title) : self.echo_title && self.echo_title[0] && self.echo_title[0]._tag ? self.echo_title[0]._tag.update_me_2(self.opts.my_title) : null;// = self.opts.is_shown;
            }, 0)
        })

    </script>
</expander>