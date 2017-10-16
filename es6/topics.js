(() => {

  function compute_mean(keys) {

    function expectation(array) {
      let norm = d3.sum(array)
      let summ = 0
      for (var i = array.length; i--;) 
        summ += i * array[i]
      return summ / (array.length * norm)
    }

    return keys.forEach(d => d.push(expectation(d[3])))
  }


  function initialize(keys) {

    function makegraph(item) {
      let td = item
        .append("td")

      let height = 3,
          width  = 10,
          colwidth = width / 104, // there are 104 years
          svg = td
        .append("svg")
          .attr("class", "topic-graph")
          .style("width", 100*width +"em")
          .style("height", 100*height + "em")
          .style("text-align", "center")
        .selectAll("rect")
        .attr("topic-num", d => d[0])
        .data(d => d[3])
        .enter()

      svg
        .append("rect")
          .attr("width", 100*colwidth + "em") // width / number of columns
          .attr("height", d => 100*height*d + "em")
          .attr("x", (d, i) => 100*i*colwidth + "em")
          .attr("y", d => 100*(height - height*d) + "em")
          .attr("fill", "#aaa")

      generate_pngs(td)
    }

    function generate_pngs(td) {
      let counter = 0
      td
        .selectAll("svg.topic-graph")
        .each(function (d, i) {
          console.log(d)
          var serializer = new XMLSerializer();
          var source = serializer.serializeToString(this);
          //add name spaces.
          if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
              source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
          }
          if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
              source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
          }
          //add xml declaration
          source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
          setTimeout(function() { saveAs(new Blob([source]), `graph-${d[0]}.svg`)} , 100 * d[0])

        })

    }

    // add a topic line to a div with data already entered
    function makelines(tbody, keys) {
      let maxprop = d3.max(keys.map((i) => i[1])),
          percent = (i) => Math.round(i*100000)/1000 + "%"

      let lines = tbody
        .selectAll("tr")
        .data(keys)
        .enter()
        .append("tr")

      lines
        .append("td")
          .attr("class", "topic-id")
          .style("text-align", "center")
          .text(d => d[0])

      makegraph(lines)
      // this is for sorting with list.js only
      lines
        .append("td")
          .attr("class", "topic-overtime")
          .text(d => percent(d[4]))
          .style("display", "none")


      lines
        .append("td")
          .attr("class", "topic-basewords")
          .text(d => d[2].join(" "))
          .style("text-align", "left")

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
          .attr("class", "topic-proportion")
          .text(d => percent(d[1]))
          .style("width", "5vw")
          .style("text-align", "left")
          .style("width")

    }

    function maketable() {
      let data  = [
        {"class": "topic-id", "text": "id", "width": "4vw" },
        {"class": "topic-overtime", "text": "over time", "width": "11vw"},
        {"class": "topic-basewords", "text": "base words", "width": "60vw"},
        {"class": "topic-proportion", "text": "proportion", "width": "20vw"},
      ]

      let table = d3
        .select("div.topic-wrapper")
        .append("table")
          .attr("class", "topic-content")

      table
        .selectAll("tr") // doesn't matter here
        .append('tr')
        .data(data)
        .enter()
        .append("th")
          .attr("class", "sort topic-header")
          .attr("data-sort", d => d.class)
          .attr("colspan", d => d.text === "proportion" ? "2" : "1")
          .style("width", d => d.width)
          .text(d => d.text)

      let tbody = table
        .append("tbody")
          .attr("class", "topic-content list")

      return [tbody, data.map(d => d.class)]
    }

    function main(keys) {
      let [tbody, value_names] = maketable(),
          lines = makelines(tbody, keys)

      new List('outer-topic-wrapper', {
        valueNames: value_names
      })

    }

    return main(keys)
  }

  function callback(error, keys) {
    data.coll_keys = keys 
    compute_mean(keys)
    initialize(keys)

    d3.select("section.background")
      .style("transition", "1.5s")
      .style("opacity", "0")

    d3.select("div.topic-wrapper")
      .transition()
      .delay(500)
      .style("transition", "1.5s")
      .style("opacity", "1")
  }



  d3.queue()
    .defer(d3.json, "https://eight1911.github.io/hansard/data/coll/keys.json")
  //.defer(d3.json, "https://eight1911.github.io/hansard/data/coll/years.json")
    .await(callback)

})()