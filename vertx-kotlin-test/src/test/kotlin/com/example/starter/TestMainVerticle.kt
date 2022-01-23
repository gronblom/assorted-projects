package com.example.starter

import io.vertx.core.Vertx
import io.vertx.core.http.HttpClientRequest
import io.vertx.core.http.HttpClientResponse
import io.vertx.core.http.HttpMethod
import io.vertx.core.json.JsonObject
import io.vertx.junit5.VertxExtension
import io.vertx.junit5.VertxTestContext
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.util.*


@ExtendWith(VertxExtension::class)
class TestMainVerticle {

  @BeforeEach
  fun deploy_verticle(vertx: Vertx, testContext: VertxTestContext) {
    vertx.deployVerticle(MainVerticle(), testContext.succeeding<String> { _ -> testContext.completeNow() })
  }

  @Test
  fun verticle_deployed(vertx: Vertx, testContext: VertxTestContext) {
    val httpClient = vertx.createHttpClient()
    httpClient.request(HttpMethod.GET, 8888, "localhost", "")
      .compose(HttpClientRequest::send)
      .compose(HttpClientResponse::body)
      .onComplete(testContext.succeeding { buffer ->
        val responseJson: JsonObject = buffer.toJsonObject()
        println(responseJson)
        Assertions.assertTrue(responseJson.containsKey("jsonIsValid"))
        Assertions.assertFalse(responseJson.getBoolean("jsonIsValid")) // No JSON body yet
        Assertions.assertTrue(responseJson.containsKey("jwt"))
        //
        val jwtParts = responseJson.getString("jwt").split(".")
        val jwtPayload = JsonObject(String(Base64.getDecoder().decode(jwtParts[1])))
        Assertions.assertTrue(jwtPayload.containsKey("foo"))
        Assertions.assertTrue(jwtPayload.getString("foo").equals("bar"))
        testContext.completeNow()
      })
  }
}
