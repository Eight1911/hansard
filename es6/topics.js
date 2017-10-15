(() => {

  function array_comp(a, b) {
    let min = d3.min(a.length, b.length)
    for (let i = 0; i < min; ++i) {
      if (a[i] > b[i])
        return -1
      else if (a[i] < b[i])
        return 1
    }
    if (a.length > b.length)
      return -1
    else if (a.length === b.length)
      return 0
    else
      return 1
  }

  function compute_mean(keys) {

    function expectation(array) {
      let norm = d3.sum(array)
      let summ = 0
      for (var i = array.length; i--;) 
        summ += i * array[i]
      return summ / (array.length * norm)
    }

    return keys.map(d => expectation(d[3]))
  }


  function initialize(keys) {

    function makegraph(item) {
      let td = item
        .append("td")
        .attr("class", "overtime")

      let height = 3,
          width  = 10,
          colwidth = width / 104, // there are 104 years
          svg = td
        .append("svg")
        .attr("class", "overtime")
        .style("width", width +"vw")
        .style("height", height + "em")
        .style("text-align", "center")
        .selectAll("rect")
        .data(d => d[3])
        .enter()

      svg
        .append("rect")
        .attr("width", colwidth + "em") // width / number of columns
        .attr("height", d => height*d + "em")
        .attr("x", (d, i) => i*colwidth + "vw")
        .attr("y", d => (height - height*d) + "em")
        .attr("fill", "#aaa")
    }

    // add a topic line to a div with data already entered
    function makelines(table, keys) {
      let maxprop = d3.max(keys.map((i) => i[1])),
          percent = (i) => Math.round(i*100000)/1000 + "%"

      let lines = table
        .data(keys)
        .enter()
        .append("tr")

      lines
        .append("td")
        .attr("class", "id")
        .style("text-align", "center")
        .text((i) => i[0])

      makegraph(lines)

      lines
        .append("td")
        .attr("class", "words")
        .style("text-align", "left")
        .text((i) => i[2].join(" "))

      let svg = lines
        .append("td")
        .attr("class", "freqblock")
        .style("text-align", "right")
        .style("width", "15vw")
        .append("svg")
        .attr("class", "freqblock")
        .style("width", "15vw")
        .style("height", "1em")
        .append("rect")
        .style("text-align", "left")
        .attr("height", "1em")
        .attr("width", d => (15*d[1]/maxprop) + "vw")
        .attr("x", d => (15 - 15*d[1]/maxprop) + "vw")
        .attr("fill", "#aaa")

      lines
        .append("td")
        .attr("class", "percentage")
        .text((i) => percent(i[1]))
        .style("width", "5vw")
        .style("text-align", "left")
    }

    function maketable() {
      let data  = [
        {"text": "ID", "width": "4vw" },
        {"text": "over time", "width": "11vw"},
        {"text": "base words", "width": "60vw"},
        {"text": "proportion", "width": "20vw"},
      ]

      let table = d3
        .select("div.wrapper")
        .append("table")
        .attr("class", "topic-content")
        .selectAll("div")

      let toclass = (s) => "topic-top-row-" + s.split(" ").join("-")
      let toelem  = (s) => `.${toclass(s)}`
      let annotate = (text, asc) => `${text} ${asc?"\u25BC":"\u25B2"}`
      let sorter = new Sorter
      let header = table
        .append('tr')
        .attr("class", "top-row")
        .data(data)
        .enter()
        .append("th")
        .text(d => d["text"] === "ID" ? d["text"] + " \u25B2": d["text"])
        .text(d => d["text"] === "ID" ? d["text"] + " \u25BC": d["text"])
        .attr("class", d => "topic-top-row " + toclass(d["text"]))
        .attr("colspan", d => d["text"] === "proportion" ? "2" : "1")
        .style("cursor", "pointer")
        .style("width", d => d["width"])
        .on("click", d => {
          let[oldtext, ascend] = sorter.sort(d["text"]),
              newtext= annotate(d["text"], ascend)

          console.log(oldtext, newtext, toelem(d['text']))

          d3.select(toelem(oldtext))
            .text(oldtext)
          d3.select(toelem(d['text']))
            .text(newtext)
        })

      return table
    }

    function main(keys) {
      let table = maketable(),
          lines = makelines(table, keys)
    }

    return main(keys)
  }



  function update(keys) {

    function makegraph(item) {
      let svg = item
        .select("td.overtime")
        .select("svg.overtime")

      let height = 3,
          width  = 10,
          colwidth = width / 104 // there are 104 years

      svg
        .selectAll("rect")
        .data(d => d[3])
        .attr("height", d => height*d + "em")
        .attr("y", d => (height - height*d) + "em")

    }

    function updatelines(table, keys) {
      let maxprob = d3.max(keys.map((i) => i[1])),
          percent = (i) => Math.round(i*100000)/1000 + "%"

      let lines = table
        .selectAll("tr")
        .data(keys)

      lines
        .select("td.id")
        .text((i) => i[0])

      makegraph(lines)

      lines
        .select("td.words")
        .text((i) => i[2].join(" "))

      let svg = lines
        .select("td.freqblock")
        .select("svg.freqblock")
        .select("rect")
        .attr("width", d => (15*d[1]/maxprob) + "vw")
        .attr("x", d => (15 - 15*d[1]/maxprob) + "vw")

      lines
        .select("td.percentage")
        .text((i) => percent(i[1]))

    }

    function main(keys) {
      let table = d3
        .select("table.topic-content")
      let lines = updatelines(table, keys)
    }

    return main(keys)

  }

  class Sorter {

    constructor() {
      this.sort_last = "ID"
      this.ascending = true
    }


    sort(name) {

      function sorter(name, ascending) {
        let means = data['means']
        let comparison = ascending ? {
          "ID":         (a, b) => a[0] - b[0],
          "over time":  (a, b) => means[a[0]] - means[b[0]],
          "base words": (a, b) => a[2][0].localeCompare(b[2][0]),
          "proportion": (a, b) => a[1] - b[1]
        } : {
          "ID":         (a, b) => - (a[0] - b[0]),
          "over time":  (a, b) => - (means[a[0]] - means[b[0]]),
          "base words": (a, b) => - a[2].join("").localeCompare(b[2].join("")),
          "proportion": (a, b) => - (a[1] - b[1])
        }

        return update(data['coll_keys'].sort(comparison[name]))
      }

      function main(object, name) {
        let oldtext = object.sort_last
        if (object.sort_last === name)
          object.ascending = !object.ascending
        else
          object.sort_last = name,
          object.ascending = false
        sorter(object.sort_last, object.ascending)
        return [oldtext, object.ascending]
      }

      return main(this, name)
    }

  }



  function callback(error, keys) {
    data['coll_keys'] = keys
    data['means'] = compute_mean(keys)
    //data['coll_years'] = years

    initialize(keys)

    d3.select("section.background")
      .style("transition", "1.5s")
      .style("opacity", "0")

    d3.select("div.wrapper")
      .transition()
      .delay(500)
      .style("transition", "1.5s")
      .style("opacity", "1")
  }



  d3.queue()
    .defer(d3.json, "https://eight1911.github.io/hansard/data/coll/keys.json")
    //.defer(d3.json, "https://eight1911.github.io/page/data/coll/years.json")
    .await(callback)

})()