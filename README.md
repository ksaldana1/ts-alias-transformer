# ts-alias-transformer
TypeScript AST transformer to resolve type aliases into fully formed interfaces. This is not a published package as of yet, so it's pretty painful for others to consume until then. I will publish this soon... at least I think. 

## Usage
* Clone repo 
* yarn install
* `npx ts-node src/index.ts ./path/to/you/model/definitions/models.ts`
* outdir hard coded right now
* your types should now be fully resolved interfaces


## Problem I'm trying to solve
I am using GraphQL at work and would like to add some type-safety around resolvers. Type safety in GQL is a bit weird to conceptualize, because resolvers are pretty dynamic by nature. Luckily I came across [graphqlgen](https://github.com/prisma/graphqlgen), which solved a lot of these problems I was having with its concept of [models](https://oss.prisma.io/graphqlgen/01-configuration.html#models). 

At work we run gRPC microservices, and GQL mostly serves as a nice fanout layer for our UI consumers. We already publish TypeScript interfaces that match our published proto contracts. I wanted to consume these types in graphqlgen, but ran into some issues due to [type export support](https://github.com/prisma/graphqlgen/issues/282) and with the way our TypeScript interfaces published (heavily namespaced, lots of references). Additionally, because graphqlgen is using babel-parser to do it's introspection and generation, it's quite limited as far as working with imported types (leads to parsing hell).

This repo is a mixture of me solving my narrow problem for work (and hopefully be extension graphqlgen), as well as demonstrating some of the power of the TypeScript compiler API. Utilizing the [Checker API](https://basarat.gitbooks.io/typescript/docs/compiler/checker.html) and a [custom transformer](https://github.com/Microsoft/TypeScript/pull/13940), I was able to solve my problem without too much hassle. 



