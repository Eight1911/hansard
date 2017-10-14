
function makegraph(item) {
  let height = 3,
      width  = 10,
      colwidth = width / 104, // there are 104 years
      svg = item
    .append("svg")
    .style("width", width +"vw")
    .style("height", height + "em")
    .selectAll("rect")
    .data((d) => d[3])
    .enter()

  svg
    .append("rect")
    .attr("width", colwidth+ "em") // width / number of columns
    .attr("height", (d) => height*d + "em")
    .attr("x", (d, i) => i*colwidth + "vw")
    .attr("y", (d) => (height - height*d) + "em")
    .attr("fill", "#aaa")

}

// add a topic line to a div with data already entered
function makelines(table, keys) {
  console.log(d3.max(keys.map((i) => i[1])))
  let maxprop = d3.max(keys.map((i) => i[1])),
      percent = (i) => Math.round(i*100000)/1000 + "%"

  let lines = table
    .data(keys)
    .enter()
    .append("tr")

  lines
    .append("td")
    .text((i) => i[0])

  makegraph(lines.append("td"))

  lines
    .append("td")
    .text((i) => i[2].join(" "))

  let svg = lines
    .append("td")
    .style("width", "15vw")
    .append("svg")
    .style("width", "15vw")
    .style("height", "1em")

  svg
    .append("rect")
    .attr("height", "1em")
    .attr("width", (d) => (15*d[1]/maxprop) + "vw")
    .attr("x", (d) => (15 - 15*d[1]/maxprop) + "vw")
    .attr("fill", "#aaa")

  lines
    .append("td")
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
    .selectAll("table")
    .append("table")


  header = table
    .append('tr')

  header
    .data(data)
    .enter()
    .append("th")
    .text((d) => d["text"])
    .attr("class", (d) => d["propotion"])
    .style("width", (d) => d["width"])
    .attr("colspan", (d) => d["text"] == "proportion" ? "2" : "1")

  return table
}


function callback(error, keys) {
  data['coll_keys'] = keys
  //data['coll_years'] = years
  
  let table = maketable()
      lines = makelines(table, keys)

  d3.select("section.background")
    .style("transition", "2s")
    .style("opacity", "0")

  d3.select("div.wrapper")
    .transition()
    .delay(1000)
    .style("transition", "2s")
    .style("opacity", "2")
}

d3.queue()
  .defer(d3.json, "https://eight1911.github.io/page/data/coll/keys.json")
  //.defer(d3.json, "https://eight1911.github.io/page/data/coll/years.json")
  .await(callback)