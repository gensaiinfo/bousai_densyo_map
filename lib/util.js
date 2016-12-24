'use strict'
const fs = require('fs');
const parse = require('csv-parse');

/**
 * CSV を JSONに変換するスクリプト
 */
const inputFile = __dirname + '/../data/saigai_densyo.csv'
const outputFile = __dirname+'/../doc/saigai_densyo.json'
fs.readFile(inputFile, function(error, data){
  if (error) console.log(error)

  var output = {}
  parse(data, {columns: true}, function(error, csv){
    if (error) console.log(error)

    csv.forEach(function(val){
      val['code6'] = ('0'+val['code6']).substr(-6)
      var vals = output[val['code6']]||[];
      vals.push(val);
      output[val['code6']] = vals
    })
    var json = JSON.stringify(output)
    fs.writeFileSync(outputFile, json)
  })
})
