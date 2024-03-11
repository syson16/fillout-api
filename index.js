const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/cLZojxk94ous/filteredResponses', (req, res) => {
    fetch('https://api.fillout.com/v1/api/forms/cLZojxk94ous/submissions', {
        headers: {Authorization: 'Bearer sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912'}
      })
        .then(resp => resp.json())
        .then(json => json.responses)
        .then(responses => {
            let filtered = [];
            responses.forEach((response) => {
                let passed = true

                // running where clause
                req.body.forEach((clause) => {
                    response.questions.forEach((question) => {
                        if (question.id === clause.id) {
                            if(question.type === 'NumberInput') {
                                if(question.value == null) {
                                    passed = false
                                }
                                const qValue = parseInt(question.value)
                                const cValue = parseInt(clause.value)
                                switch(clause.condition) {
                                    case 'equals':
                                        if(qValue !== cValue) {
                                            passed = false
                                        }
                                        break;
                                    case 'does_not_equal':
                                        if(qValue === cValue) {
                                            passed = false
                                        }
                                        break;
                                    case 'greater_than' :
                                        if(qValue <= cValue) {
                                            passed = false
                                        }
                                        break;
                                    case 'less_than':
                                        if(qValue >= cValue) {
                                            passed = false
                                        }
                                        break;
                                    default:
                                        passed = false
                                }
                            } else if (question.type === 'DatePicker') {
                                if(question.value == null) {
                                    passed = false
                                }
                                const qValue = new Date(question.value)
                                const cValue = new Date(clause.value)
                                switch(clause.condition) {
                                    case 'equals':
                                        if(qValue.getTime() != cValue.getTime()) {
                                            passed = false
                                        }
                                        break;
                                    case 'does_not_equal':
                                        if(qValue.getTime() == cValue.getTime()) {
                                            passed = false
                                        }
                                        break;
                                    case 'greater_than' :
                                        if(qValue <= cValue) {
                                            passed = false
                                        }
                                        break;
                                    case 'less_than':
                                        if(qValue >= cValue) {
                                            passed = false
                                        }
                                        break;
                                    default:
                                        passed = false
                                }
                            } else {
                                if(question.value == null) {
                                    passed = false
                                }
                                const qValue = String(question.value)
                                const cValue = String(clause.value)
                                switch(clause.condition) {
                                    case 'equals':
                                        if(qValue !== cValue) {
                                            passed = false
                                        }
                                        break;
                                    case 'does_not_equal':
                                        if(qValue === cValue) {
                                            passed = false
                                        }
                                        break;
                                    case 'greater_than' :
                                        if(qValue <= cValue) {
                                            passed = false
                                        }
                                        break;
                                    case 'less_than':
                                        if(qValue >= cValue) {
                                            passed = false
                                        }
                                        break;
                                    default:
                                        passed = false
                                }
        
                            }
                        }
                    })
                })
                if(passed) {
                    filtered.push(response)
                }
            })
            return filtered
        })
        .then(filtered => {
            const jsonResponse = {
                "responses": filtered,
                "totalResponses": filtered.length,
                "pageCount": 1
            }
            res.json(jsonResponse)
        })
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})