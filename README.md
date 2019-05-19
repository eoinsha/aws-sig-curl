# aws-sig-curl

**aws-sig-curl** is a cURL command wrapper that adds AWS v4 signature headers.

It supports credentials in AWS environment variables and profiles (including assumed roles for cross account access, etc.)

## Usage

```sh
npm install -g aws-sig-curl
```

```sh
AWS_PROFILE=myprofile aws-sig-curl -v https://gwid.execute-api.eu-west-1.amazonaws.com/prod/user/
```

All options supported by your underlying [cURL](https://curl.haxx.se/) version are supported since `aws-sig-curl` passes through everything, adding opnly the signature headers.

## About

This module is based on these excellent projects.

- [awscred](https://github.com/mhart/awscred)
- [aws4](https://github.com/mhart/aws4)
- [cURL](https://curl.haxx.se/)

Once the signature headers are derived, `curl` is invoked using Node.js' [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

## LICENSE

[MIT](./LICENSE)

