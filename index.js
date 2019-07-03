#!/usr/bin/env node
'use strict'

const { spawn } = require('child_process')
const { URL } = require('url')

const axios = require('axios')
const aws4 = require('aws4')
const awscred = require('awscred')
const argv = require('yargs').argv

const [,, ...curlOpts] = process.argv
const url = curlOpts.pop()

awscred.loadCredentialsAndRegion(credentialsLoaded)

function credentialsLoaded (err, credentialData) {
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
  } = credentialData

  let body
  body = argv.data || argv.d
  if (body) {
    if (body.startsWith('@')) {
      body = fs.readFileSync(body.substring(1))
    }
  }

  const method = argv.request || argv.X
  const { host, pathname, search } = new URL(url)
  const request = {
    method,
    url,
    path: pathname + search,
    host,
    region,
    body
  }

  const { headers } = aws4.sign(request, {
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

