

function home() {

  const graphpath = 'data/img/topic-graph-png'

  function initbody() {
    return d3
      .select("section.body#body")
      .html("")
  }

  function inittable(body) {


    function maketable(body) {
      const table = body
        .append("section")
        .attr("class", "table")
      initheader(table) 
      const tbody = table
        .append("section")
        .attr("class", "list tbody")
        .selectAll("div")
        .data(maindata.topic)
        .enter()
      return [table, tbody]
    }

    function addid(row) {
      row
        .append("div")
        .attr("class", "topic-id")
        .text((d, i) => i)
    }

    function addfreq(row) {
      row
        .append("img")
        .attr("class", "topic-freq")
        .attr("src", (d, i) => 
          `${graphpath}/graph-${i}.png`)
    }

    function addword(row) {
      const data = row
        .append("div")
        .attr("class", "topic-word")
        .selectAll('a')
        .data(d => d.words)
        .enter()
        .append('a')
        .attr('href', d => `#/word/?word[]=${d.word}`)
        .text(d => d.word)

    }

    function addprop(row) {
      row
        .append("div")
        .attr("class", "topic-prop")
        .text(d => util.topercent(d.prop))
    }

    function addbar(row) {
      const props = maindata.topic
        .map(d => d.prop)
      const max = util.max(props)
      row
        .append("div")
        .attr("class", "topic-bar")
        .append("div")
        .attr("class", "topic-subbar")
        .style("width", d => 100*d.prop / max + "%")
    }

    function addhidden(row) {
      const intmean = x => 
        Math.round(util.mean(x)*100000)
      row
        .append("div")
        .attr("class", "topic-mean")
        .text(d => intmean(d.wordprop))
      row
        .append("div")
        .attr("class", "topic-subprop")
        .text(d => Math.round(d.prop*100000))
      row
        .append("div")
        .attr("class", "topic-string")
        .text(d => d.words.map(d => d.word).join(", "))
    }

    function makerow(table) {
      const row = table
        .append("a")
        .attr("href", (d, i) => `#/topic/${i}/`)
        .append("div")
        .attr("class", "topic-row")
      return row
    }


    function initheader(table) {
      const year = maindata.year
      const head = table
        .append("div")
        .attr("class", "row-head")
      head
        .append("div")
        .attr("class", "sort row-head-id")
        .attr("data-sort", "topic-id")
        .text("id")
      head
        .append("div")
        .attr("class", "sort row-head-freq")
        .attr("data-sort", "topic-mean")
        .text("frequencies")
      head
        .append("div")
        .attr("class", "sort row-head-word")
        .attr("data-sort", "topic-string")
        .text("important words")
      head
        .append("div")
        .attr("class", "sort row-head-prop")
        .attr("data-sort", "topic-subprop")
        .text("proportion of corpus")

    }

    function main(body) {
      const [table, tbody] = maketable(body)
      const row = makerow(tbody)
      // generate_svgs(row)
      addid(row)
      addfreq(row)
      addword(row)
      addprop(row)
      addbar(row)
      addhidden(row)
    }

    return main(body)
  }

  function setsearch(body) {
    const header = body
      .append("section")
      .attr("class", "header")

    header.append("input")
      .attr("type", "text")
      .attr("class", "search")
      .attr("placeholder", "search")

    header.append("input")
      .attr("type", "text")
      .attr("class", "fuzzy-search")
      .attr("placeholder", "fuzzy")
  }


  function main() {
    const body = util.clearbody()
    util.setcss("home")
    setsearch(body)
    inittable(body)

    const valueNames = [ 'topic-id', 'topic-mean', 'topic-string', 'topic-subprop']
    const list = new List('body', { valueNames })

  }   

  return main()

}





// this thing generates the svg 
// for filling the plot on the right
function generate_svgs(item) {

  function makegraph(item) {
    const div = item.append("div")
    const height = 30
    const width  = 100
    const colwidth = width / maindata.year.length
    const svg = div
      .append("svg")
        .attr("class", "topic-graph")
        .style("width", width +"em")
        .style("height", height + "em")
        .style("text-align", "center")

    const rects = svg
      .selectAll("rect")
      .attr("topic-num", (d, i) => i)
      .data(d => util.scalemax(d.wordprop))
      .enter()
      .append("rect")
        .attr("width", colwidth + "em") // width / number of columns
        .attr("height", d => height*d + "em")
        .attr("x", (d, i) => i*colwidth + "em")
        .attr("y", d => (height - height*d) + "em")
        .attr("fill", "#444")

    generate_pngs(svg)
  }

  // save files to pngs
  function generate_pngs(svgs) {
    svgs.each((d, i, item) => {
      console.log(d, i, item[i])
      var serializer = new XMLSerializer();
      var source = serializer.serializeToString(item[i]);
      //add name spaces.
      if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }
      //add xml declaration
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      setTimeout(() => saveAs(new Blob([source]), `graph-${i}.svg`), 50 * i)
    })
  }

  return makegraph(item)
 }
