riot.tag2('echo_html', '<div id="content_div"></div>', '', '', function(opts) {
var self = this;
self.content_div.innerHTML = self.opts.content;
self.update_me = function () {
    "use strict";
    var my_element = document.createElement('div');
    my_element.innerHTML = self.opts.content;

    self.content_div.appendChild(my_element);
};
self.update_me_2 = function (content) {
    "use strict";
    self.content_div.innerHTML = content;
};
});