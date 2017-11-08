// to do add buttons links
// add filters for documents by year
// add color change on hover on list sorters

function topic({id}, query) {

  function initleft(body, topic) {

    function addwords(body, topic) {

      function push(divword, data) {
        const max = util.max(data.map(d => d.prop))
        divword
          .append("div")
          .attr("class", "word-text")
          .text(d => d.word)
        divword
          .append("div")
          .attr("class", "word-prop")
          .text(d => util.topercent(d.prop))
        divword
          .append("div")
          .attr("class", "word-bar")
          .append("div")
          .attr("class", "word-subbar")
          .style("width", d => util.topercent(d.prop/max))
      }

      function main(body, topic) {  
        const divword = body
          .append("div")
          .attr("class", "left")
          .selectAll("div")
          .data(topic.words)
          .enter()
          .append("a")
          .attr("href", d => `#/word/?word[]=${d.word}`)
          .append("div")
          .attr("class", "word")

        push(divword, topic.words)
      }

      return main(body, topic)


    }

    function main(body, topic) {
      const left = body
        .append("div")
        .attr("class", "left")
      addwords(body, topic)
    }
    return main(body, topic)
  }

  function initmidd(body, topic) {

    function initplot(midd, prop) {
      const datalen = prop.length
      const onepart = 100 / datalen
      const forewidth = 0.5 * onepart
      const padding = (onepart - forewidth) / 2

      const max  = util.max(prop)
      prop = prop.map(x => 0.9*x/max)

      const plot = midd
        .append("svg")
        .attr("class", "topic-plot")
        .selectAll("rect")
        .data(prop)
        .enter()

      plot
        .append("rect")
        .attr("class", "fore")
        .attr("height", d => d*100 + "%")
        .attr("width", forewidth + "%")
        .attr("x", (d, i) => i*onepart + padding + "%")
        .attr("y", d => (1-d)*100 + "%")

      plot
        .append("rect")
        .attr("class", "back")
        .attr("height", "100%")
        .attr("width", onepart+0.2 + "%")
        .attr("x", (d, i) => i*onepart-0.1 + "%")
        .attr("y", "0")
    }

    function initdocs(midd, topic) {

      function addcount(docnode) {
        docnode
          .append("div")
          .attr("class", "doc-count")
          .text(d => d.doc.words)
      }

      function addnames(docnode) {
        docnode
          .append("div")
          .attr("class", "doc-name")
          .text(d => d.doc.name)
      }

      function addprop(docnode) {
        docnode
          .append("div")
          .attr("class", "doc-prop")
          .text(d => util.topercent(d.prop))
      }

      function addyear(docnode) {
        docnode
          .append("div")
          .attr("class", "doc-date")
          .text(d => d.doc.date)
      }

      function addbar(docnode, docs) {
        const max = util.max(docs.map(d => d.prop))
        docnode
          .append("div")
          .attr("class", "doc-bar")
          .append("div")
          .attr("class", "doc-subbar")
          .style("width", d => util.topercent(d.prop/max))
      }

      function addhidden(docnode) {
        docnode
          .append("div")
          .attr("class", "doc-year")
          .text(d => d.doc.year)
        docnode
          .append("div")
          .attr("class", "doc-hidd-prop")
          .text(d => Math.round(d.prop * 1000000))
      }

      function addhead(midd) {
        const head = midd
          .append("div")
          .attr("class", "head")

        head
          .append("div")
          .attr("class", "sort head-date")
          .attr("data-sort", "doc-date")
          .text("date")
        head
          .append("div")
          .attr("class", "sort head-name")
          .attr("data-sort", "doc-name")
          .text("name")
        head
          .append("div")
          .attr("class", "sort head-count")
          .attr("data-sort", "doc-count")
          .text("tokens")
        head
          .append("div")
          .attr("class", "sort head-prop")
          .attr("data-sort", "doc-hidd-prop")
          .text("proportion")

      }

      function putdata(docnode, data) {
        addyear(docnode)
        addnames(docnode)
        addcount(docnode)
        addprop(docnode)
        addbar(docnode, data)
        addhidden(docnode)

        const valueNames = [ 'doc-name', 'doc-year', 'doc-date', 'doc-count', 'doc-hidd-prop']
        const list = new List('body', { valueNames });
      }

      function maindoc(midd, topic) {
        const doc = maindata.doc
        const data = topic.docs
          .map(({key, prop}) =>({prop, doc:doc[key]}))
        addhead(midd)
        const docnode = midd
          .append("div")
          .attr("class", "topic-docs list")
          .selectAll("p")
          .data(data)
          .enter()
          .append("a")
          .attr("href", d => d.doc.link)
          .attr("target", "_blank")
          .append("div")
          .attr("class", "topic-doc")
        putdata(docnode, data)

      }

      return maindoc(midd, topic)

    }


    function main(topic) {
      const midd = body
        .append("div")
        .attr("class", "middle")
      initplot(midd, topic.wordprop)
      initdocs(midd, topic)
    }

    return main(topic)
    

  }

  function initprop(body, topic) {
    const max = util.max(maindata.topic.map(d => d.prop))
    const topbar = body
      .append("div")
      .attr("class", "proportion")
    topbar
      .append("h")
      .attr("class", "topic-id")
      .text("#" + id)
  }

  function main(id) {
    util.setcss('topic')
    const topic = maindata.topic[id]
    const body = util.clearbody()
    initprop(body, topic)
    initmidd(body, topic)
    initleft(body, topic)
  }

  return main(id)

}