
import Vue from 'vue'
import LazyLoad from 'lazyload'

class App {

  constructor() {

    function loadapp(self) {
      const tmpl = Vue.compile(require('../data/tmpl/index.vue'))
      const length = 100
      const data = { items : self.items, app : self }


      const options = {
        el              : '#mainapp',
        data            : data,
        render          : tmpl.render,
        staticRenderFns : tmpl.staticRenderFns,
      }
      return new Vue(options)
    }

    function makeitems(self) {
      const items = []
      const data = self.data = require("../data/front.json")
      const max = Math.max(...data.map(d => d.prop))
      let total = 0
      for (const d of data)
        total += d.prop
      return data.map(item => ({
        id : item.id, 
        prop : item.prop / total,
        width : item.prop / max
      })).sort( (a, b) => b.prop - a.prop )
    }

    function main(self) {
      self.items = makeitems(self)
      self.vue = loadapp(self)
      self.sortkey = false

      setTimeout(() => self.lazy = new LazyLoad(), 100)
    }

    return main(this)
  }

  sort() {
    if (this.sortkey)
      this.vue.items.sort((a, b) => b.prop - a.prop)
    else
      this.vue.items.sort((a, b) => a.id - b.id)
    this.sortkey = !this.sortkey
    setTimeout(() => this.lazy.loadImages(), 100)
  }

}

const app = new App()
