const valueColorClass = {
  methods: {
    getRatingValueClass (value, context) {
      value = parseInt(value)
      context = context || 'text'

      if (context === 'text') {
        context = 'has-text'
      }

      if (context === 'background') {
        context = 'has-background'
      }

      if (value < 50) { return `${context}-danger` } else
      if (value < 75) { return `${context}-warning` } else
      if (value < 90) { return `${context}-info` } else
      if (value) { return `${context}-primary` }
    }
  }
}

export {
  valueColorClass
}
