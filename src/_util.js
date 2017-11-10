

let maindata
let router
const globs = {}
const cssnames = {
  "home": "./css/home.css",
  "word": "./css/word.css",
  "topic": "./css/topic.css",
}


const util = (() => {

  function contains(list, item) {
    return list.reduce((b, i) => b || i === item, false)
  }

  function getid(id) {
    const element = document.getElementById(id)
    if (!element)
      throw `no element with id ${id}`
    return element
  }

  function topercent(s, precision=1) {
    s = `${100*s}`
    const [l, r] = s.includes(".")
      ? s.split(".")
      : [s, ""]
    
    const decimal = r.slice(0, 2) 
    return `${l}.${decimal}%`

  }

  function setcss(name) {
    if (!cssnames[name])
      throw `css file not found for name ${name}`

    d3.select('head')
      .selectAll("link.changeable-css")
      .attr("disabled", d => 
        d.name === name ? undefined : "disabled")
  }

  function clearbody() {
    return d3
      .select("section.body#body")
      .html("")
  }

  function print(item) {
    return item
  }

  function max(array) {
    if (!array.length)
      throw "finding maximum of an empty array"
    return array.reduce((a, b) => a > b ? a : b)
  }

  function range(start, end) {
    const array = []
    if (end === undefined)
      [start, end] = [0, start]

    for (let i = start; i < end; ++i)
      array.push(i)

    return array
  }


  function mean(array) {
    const norm = array.reduce((a, b)=>a+b)
    let summ = 0
    for (let i = array.length; i--;) 
      summ += i * array[i]
    return summ / (array.length * norm)
  }


  function scalemax(array) {
    const maximum = max(array)
    const rectify = maximum > 0 ? maximum : 1e-10
    return array.map(d => d/maximum)
  }


  function parseuri(str) {
    const args = str.split("&")
    const dict = {}
    args.forEach(arg => {
      let [key, value] = arg.split("=").map(decodeURIComponent)
      if (key.slice(-2) === "[]" && (key = key.slice(0, -2))) 
        key in dict 
          ? dict[key].push(value) 
          : dict[key] = [value]
      else
        dict[key] = value
    })

    return dict
  }

  function dumpuri(dict) {
    console.log(dict)
    const pairs = []
    const enc = encodeURIComponent
    for (let i in dict)
      if (print(dict[i]) instanceof Array)
        dict[i].forEach(obj => pairs.push([ enc(print(i))+"[]", enc(obj) ]))
      else
        pairs.push([enc(i), enc(dict[i])])
    return pairs
      .map(([key, val]) => `${key}=${val}`)
      .join("&")

  }

  return {
    getid, setcss, clearbody, topercent, contains,
    max, print, mean, range, scalemax, parseuri, dumpuri,
  }

})()

