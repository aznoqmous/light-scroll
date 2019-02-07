class LightScroll {

    constructor(config) {
        this.init(config);
    }

    init(config) {
        this.getConfig(config);

        this.buildStyle();

        this.els = this.getEls();
        this.setAllElsOff();


        this.bind();
        if(this.config.debug) this.buildDebug();

        var self = this;
        setTimeout(function(){
            self.initElsState();
        }, 100);
    }
    getConfig(config){
        this.dconf = {
            debug: false,
            selector: 'ls',
            offClassName: 'ls-off',
            loadedClassName: 'ls-on',
            onY: window.innerHeight / 4 * 3,
            offY: 0,
            reload: false,
            transition: 500,
        }
        this.dconf.delay = this.dconf.transition / 2;
        this.config = Object.assign(this.dconf, config);
    }

    setAllElsOff() {
        for (var i = 0; i < this.els.length; i++) {
            var el = this.els[i];
            el.classList.add(this.config.offClassName);
            el.style.opacity = 0;
        }
    }
    initElsState() {
        for (var i = 0; i < this.els.length; i++) {
            var el = this.els[i];
            el.style.opacity = 'inherit';
            this.tryToggle(el);
            if(el.classList.contains( this.config.selector + '-opacity' )) {
                if (el.style.removeProperty) el.style.removeProperty('opacity');
                else el.style.removeAttribute('opacity');
            }
        }
    }

    buildDebug(){

        this.debugOnY = document.createElement('div');
        this.debugOnY.classList.add(this.config.selector + '-debug-onY');

        var styles = {
            position: "fixed",
            top: this.config.onY + 'px',
            left: 0,
            height: '1px',
            width: '50px',
            background: 'red'
        }

        this.setStyles(this.debugOnY, styles);
        document.body.appendChild(this.debugOnY);

        for (var i = 0; i < this.els.length; i++){
            var el = this.els[i];
            el.parentElement.style.borderTop = '1px solid red';
        }
    }

    setStyles(el, styles){
        for(var prop in styles){
            el.style[prop] = styles[prop];
        }
    }

    buildStyle() {
        this.style = document.createElement('style');
        this.style.innerHTML = '.' + this.config.selector + '{ transition: all '+ this.config.transition +'ms ease } \n';
        this.style.innerHTML += '.' + this.config.selector +'.'+this.config.loadedClassName+':not(.' + this.config.selector +'-opacity){opacity: 1}';
        // BOTTOM
        this.style.innerHTML +=
            '.' + this.config.selector +'-bottom.' + this.config.offClassName + ' { transform: translate( 0, 100vh) } \n' +
            '.' + this.config.selector +'-bottom { transform: translate( 0, 0 ) } \n';
        // RIGHT
        this.style.innerHTML +=
            '.' + this.config.selector +'-right.' + this.config.offClassName + ' { transform: translate( 100vw, 0) } \n' +
            '.' + this.config.selector +'-right { transform: translate( 0, 0 ) } \n';
        // RIGHT BOTTOM
        this.style.innerHTML +=
            '.' + this.config.selector +'-right-bottom.' + this.config.offClassName + ' { transform: translate( 100vw, 100vh) } \n' +
            '.' + this.config.selector +'-right-bottom { transform: translate( 0, 0 ) } \n';
        // LEFT
        this.style.innerHTML +=
            '.' + this.config.selector +'-left.' + this.config.offClassName + ' { transform: translate( -100vw, 0) } \n' +
            '.' + this.config.selector +'-left { transform: translate( 0, 0 ) } \n';
        // LEFT BOTTOM
        this.style.innerHTML +=
            '.' + this.config.selector +'-left-bottom.' + this.config.offClassName + ' { transform: translate( -100vw, 100vh) } \n' +
            '.' + this.config.selector +'-left-bottom { transform: translate( 0, 0 ) } \n';
        // OPACITY
        this.style.innerHTML +=
            '.' + this.config.selector +'-opacity.' + this.config.offClassName + '{ opacity: 0 } \n' +
            '.' + this.config.selector +'-opacity { opacity: 1 } \n';
        // SCALE
        this.style.innerHTML +=
            '.' + this.config.selector +'-scale.' + this.config.offClassName + '{ transform: scale(0) } \n' +
            '.' + this.config.selector +'-scale { transform: scale(1) } \n';
        // DELAY
        this.style.innerHTML +=
            '.' + this.config.selector + '.' + this.config.selector +'-delay-0 { transition-delay: '+ 0 * this.config.delay +'ms }\n'+
            '.' + this.config.selector + '.' + this.config.selector +'-delay-1 { transition-delay: '+ 1 * this.config.delay +'ms }\n'+
            '.' + this.config.selector + '.' + this.config.selector +'-delay-2 { transition-delay: '+ 2 * this.config.delay +'ms }\n'+
            '.' + this.config.selector + '.' + this.config.selector +'-delay-3 { transition-delay: '+ 3 * this.config.delay +'ms }\n'+
            '.' + this.config.selector + '.' + this.config.selector +'-delay-4 { transition-delay: '+ 4 * this.config.delay +'ms }\n'+
            '.' + this.config.selector + '.' + this.config.selector +'-delay-5 { transition-delay: '+ 5 * this.config.delay +'ms }\n'
        ;

        document.body.appendChild(this.style);
    }

    getEls() {
        return document.getElementsByClassName(this.config.selector);
    }

    bind() {
        var self = this;
        document.addEventListener('scroll', function () {
            for (var i = 0; i < self.els.length; i++) {
                var el = self.els[i];
                self.tryToggle(el);
            }
        }, true);
    }

    tryToggle(el) {
        var elTop = el.parentElement.getBoundingClientRect().top;
        if ( elTop < this.config.onY) this.setOn(el);
        else if (this.config.reload && elTop > this.config.offY) this.setOff(el);
    }

    setOff(el) {
        el.classList.add(this.config.offClassName);
    }

    setOn(el) {
        el.classList.remove(this.config.offClassName);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    /*
    * Here comes the launch
    * See default config and available options in getConfig() method.
    * */
    new LightScroll({
        delay: 200,
        transition: 1000,
        // debug: true
    });
});
