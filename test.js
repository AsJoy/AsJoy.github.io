var b = a.substr(1).substr(0, a.length-2)
      c = `tag  name  value
      ${b.replace(/(\([0-9a-zA-Z,\s]*\))([\sa-z'A-Z]*)[a-zA-Z]*:([^(]*)/g, ($0, $1,$2, $3, str) => {
      var s = $1 
      return `${$1.trim()}  ${$2.trim()}  ${$3.substr(0, $3.indexOf(','))}
      `
      })}`