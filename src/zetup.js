

const pathfunc = [
  ["/topic/:id",  topic       ],
  ["/word/",      word        ],
  [home,          undefined   ],
]

function initcss(cssnames) {
  const data = Object.entries(cssnames).map(([name, path]) => ({name, path}))
  d3.select("head")
    .selectAll("link.changeable-css")
    .data(data)
    .enter()
    .append("link")
    .attr("rel", "stylesheet")
    .attr("id", d => d.name)
    .attr("href", d => d.path)
    .attr("class", d => `changeable-css`)
    // .attr("disabled", "true")
}

function inittopic(json) {
  const topic = json.topic
  const year  = json.year
  const range = util.range(topic.length)
  const wordprop = range.map(i => 
    year.map(row => row.wordvec[i]))
  const docprop = range.map(i => 
    year.map(row => row.docvec[i]))

  topic.forEach((t,i) => {
    t.wordprop = wordprop[i]
    t.docprop = docprop[i]
  })

}

function initialize(json) {
  console.log(json)
  maindata = json
  inittopic(json)
  initcss(cssnames)
  router = new Navigo(null, true) 
  const map = ([path, func]) => 
    router.on(path, func)
  pathfunc.map(map)
  router.resolve()
}

d3.json("./data/data.json", initialize)

