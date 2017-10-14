

let data = {
    'coll_keys' : null,
    'coll_years': null
}


function set_topics(error, keys, years) {
    console.log(keys)
    console.log(years)

    `
    let divs = d3.select("div.content")
                 .selectAll('div')
                 
    divs.data(testdata)
        .enter()
        .append("div")
        .classed("topic-line", true)
        .text((i) => "this is the " + i)
    `
}


d3.queue()
  .defer(d3.csv, "../data/coll/keys.tsv")
  .defer(d3.csv, "../data/coll/years.json")
  .await(set_topics)