
import Navigo from 'navigo'
import Vue from 'vue'

class App {

  constructor() {

    function loadapp(self) {
      const keys = Object.keys(self.data).sort()
      console.log(self.data)
      const tmpl = Vue.compile(require('../data/tmpl/map.html'))
      const data = {
        keys : keys,
        curr : 0,
        app  : self
      }
      const computed = {
        data    : () => self.data[keys[data.curr]],
        wwidth  : () => (console.log(window.innerWidth), window.innerWidth),
        wheight : () => window.innerHeight
      }

      const options = {
        el              : '#mainapp',
        data            : data,
        computed        : computed,
        render          : tmpl.render,
        staticRenderFns : tmpl.staticRenderFns,
      }
      console.log(keys)

      return new Vue(options)
    }

    function loadrouter(self, hash) {
      const router = new Navigo('./topic/', true, hash)
      // router
      //  .on('topic', () => router.navigate(first))
      // setTimeout(() => router.resolve(), 0)
      return router
    }

    function preprocess(raw) {
      const data = {}
      for (const [k, {x, y}] of Object.entries(raw)) {
        const max_x = Math.max(...x)
        const max_y = Math.max(...y)
        const min_x = Math.min(...x)
        const min_y = Math.min(...y)
        const scale = Math.max(max_y - min_y, max_x - min_x)
        data[k] = {
          x : x.map(p => (p - min_x) / scale),
          y : y.map(p => (p - min_y) / scale)
        }
      }

      return data
    }

    function main(self) {
      self.raw = require('../data/data.json')
      self.data = preprocess(self.raw)
      self.vue = loadapp(self)
      self.hash = "#!"
      self.router = loadrouter(self, self.hash)
    }

    return main(this)

  }

  change(index) {
    this.vue.curr = index
  }

}

const app = new App()