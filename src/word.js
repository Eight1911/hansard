


function word(_, querystr) {

  function buildgraph(body) {

    const graph = body
      .append("div")
      .attr("class", "word-graph")
    const selword = body
      .append("div")
      .attr("class", "right")
    return [graph, selword]


    return main(body)
    
  }

  function addwords(graph, word) {
    const [start, stop] = maindata.range
    const range = util.range(start, stop)
    const data = maindata.word[word]
    const axis = d2b.chartAxis()
    console.log(data)
    console.log( range.map( (x,i) => ({x:x, y:data[i]}) ) )
    console.log(data)
    graph
      .datum({
      sets: [{
        generators: [d2b.svgLine(), d2b.svgScatter()],
        graphs: [ { label: word, values: range.map((x,i) => ({x:i, y:data[i]})) } ]
      }]
    }).call(axis)
  }
  function main() {
    util.setcss('word')
    const body = util.clearbody()
    const query = util.parseuri(querystr)
    const words = query.word
    const [svg, selword] = buildgraph(body)
    console.log(words)

    addwords(svg, words)

  }


  return main()
}

