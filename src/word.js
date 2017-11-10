let add_new_word
let sub_old_word


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

  function createwords(graph, words) {

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
      const line = d2b.svgLine()
      // line.line().curve(d3.curveBasis)
      const generators = [ line, d2b.svgScatter() ]
      const graphs = words.map(grapher)
      const sets = [{ generators, graphs }]
      const chart = graph.datum({ sets })
      chart.call(axis)
      window.addEventListener('resize', () => chart.call(axis))
    }

    return main(graph, words)
  }

  function createselection(selword, word) {
    console.log(word)
    const catalog = selword
      .selectAll("div")
      .data(word)
      .enter()

    catalog
      .append("div")
        .attr("class", "selected-word")
        .attr('onclick', d => `sub_old_word("${util.print(d)}")`)
        .text(d => d)
  }

  function createhead(selword, words) {

    const allwords = Object.keys(maindata.word)
    const form = selword
      .append("form")
    form
      .append("datalist")
        .attr("id", "wordlist")
      .selectAll("option")
      .data(allwords)
      .enter()
      .append("option")
        .attr("value", d=>d)

    form
      .append("input")
      .attr("id", "input-word")
      .attr("class", "word-search")
      .attr("list", "wordlist")
      .attr("placeholder", "search")
    form
      .attr("onsubmit", `add_new_word()`)
  }


  function main() {
    util.setcss('word')
    const body = util.clearbody()
    const query = util.parseuri(querystr)
    const words = query.word
    const [svg, selword] = buildgraph(body)
    createhead(selword, words)
    createselection(selword, words)

    add_new_word = () => {
      event.preventDefault()
      word = util.getid("input-word").value

      if (!(word in maindata.word))
        return window.alert("word not found")
      if (util.contains(words, word))
        return
      words.push(word)
      window.location.href = `./#/word/?${util.dumpuri({word:words})}`
    }

    sub_old_word = (word) => {
      if (!util.contains(words, word))
        return
      const ind = words.indexOf(word)
      console.log(ind)
      console.log("what")
      words.pop(ind)
      console.log(words)
      window.location.href = `./#/word/?${util.dumpuri({ word:words })}`
    }

    setTimeout(() => createwords(svg, words), 0)

  }


  return main()
}

