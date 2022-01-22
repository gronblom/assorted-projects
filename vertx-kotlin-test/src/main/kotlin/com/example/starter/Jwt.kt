package com.example.starter

import io.vertx.core.Vertx
import io.vertx.ext.auth.PubSecKeyOptions
import io.vertx.ext.auth.jwt.JWTAuth
import io.vertx.ext.auth.jwt.JWTAuthOptions

class Jwt {
  companion object {
    @JvmStatic
    fun createProvider(vertx: Vertx): JWTAuth {
      return JWTAuth.create(
        vertx, JWTAuthOptions()
          .addPubSecKey(
            PubSecKeyOptions()
              .setAlgorithm("HS256")
              .setBuffer("my precious secret")
          )
      )
    }
  }
}
