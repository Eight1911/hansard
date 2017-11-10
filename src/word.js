


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

  function addwords(graph, words) {

    const [start, stop] = maindata.range
    const range = util.range(start, stop)
    
    function zip_xy(a, b) {
      return a.map((item, ind) => ({ x:item, y:b[ind] }))
    }

    function grapher(word) { 
      return { label: word, values: zip_xy(range, maindata.word[word]) }
    }


    function main(graph, words) {
      const axis = d2b.chartAxis()
      const generators = [ d2b.svgLine(), d2b.svgScatter() ]
      const graphs = words.map(grapher)
      const sets = [{ generators, graphs }]
      console.log(graphs)
      return graph
        .datum({ sets })
        .call(axis)
    }

    return main(graph, words)
  }

  function main() {
    util.setcss('word')
    const body = util.clearbody()
    const query = util.parseuri(querystr)
    const words = query.word
    const [svg, selword] = buildgraph(body)
    console.log("Word", words[0], query.word)

    setTimeout(() => addwords(svg, words), 100)

  }


  return main()
}

