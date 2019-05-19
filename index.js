'use strict'

const { spawn } = require('child_process')
const { URL } = require('url')

const axios = require('axios')
const aws4 = require('aws4')
const awscred = require('awscred')

const [,, ...curlOpts] = process.argv
const url = curlOpts.pop()

if (!url) {
  throw new Error('No URL specified')
}

awscred.loadCredentialsAndRegion(credentialsLoaded)

function credentialsLoaded (err, data) {
  if (err) {
    console.error({ err }, 'Failed to load credentials')
    process.exit(1)
  }
  const {
    credentials: {
      accessKeyId,
      secretAccessKey,
      sessionToken
    },
    region
  } = data

  const { host, pathname } = new URL(url)
  const { headers } = aws4.sign({
    path: pathname,
    host,
    region,
  }, {
    accessKeyId,
    secretAccessKey,
    sessionToken
  })

  Object.entries(headers).forEach(([key, value]) => {
    curlOpts.push('-H')
    curlOpts.push(`${key}: ${value}`)
  })
  curlOpts.push(url)

  spawn('curl', curlOpts, { stdio: 'inherit' })
}
