package com.example.starter

import io.vertx.core.AbstractVerticle
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.BodyHandler
import io.vertx.json.schema.*
import io.vertx.kotlin.core.json.json
import io.vertx.kotlin.core.json.obj


val loginSchema = "{\n" +
  "    \"\$schema\": \"https://json-schema.org/draft/2019-09/schema\",\n" +
  "    \"title\": \"Login credentials\",\n" +
  "    \"description\": \"JSON schema for login object\",\n" +
  "    \"type\": \"object\",\n" +
  "    \"properties\": {\n" +
  "        \"login\": {\n" +
  "            \"description\": \"Login\",\n" +
  "            \"type\": \"string\",\n" +
  "            \"minLength\": 2\n" +
  "        },\n" +
  "        \"password\": {\n" +
  "            \"description\": \"Password\",\n" +
  "            \"type\": \"string\",\n" +
  "            \"minLength\": 8\n" +
  "        }\n" +
  "    },\n" +
  "    \"required\": [\"login\", \"password\"]\n" +
  "}"

class MainVerticle : AbstractVerticle() {
  override fun start() {
    // Create a Router
    val router = Router.router(vertx)

    val schemaRouter = SchemaRouter.create(vertx, SchemaRouterOptions())
    val schemaParser = SchemaParser.createDraft201909SchemaParser(schemaRouter)
    val schema: Schema = schemaParser.parseFromString(loginSchema)

    router.route().handler(BodyHandler.create())
    // Mount the handler for all incoming requests at every path and HTTP method
    router.route().handler { context ->
      val address = context.request().connection().remoteAddress().toString()
      val jsonData = context.bodyAsJson ?: JsonObject()
      val jsonIsValid = validateJson(schema, jsonData)

      val jwtProvider = Jwt.createProvider(vertx)
      val token = jwtProvider.generateToken(JsonObject().put("foo", "bar"))

      // Write a json response
      context.json(
        json {
          obj(
            "from" to address,
            "message" to jsonData,
            "jsonIsValid" to jsonIsValid,
            "jwt" to token
          )
        }
      )
    }

    // Create the HTTP server
    vertx.createHttpServer()
      // Handle every request using the router
      .requestHandler(router)
      // Start listening
      .listen(8888)
      // Print the port
      .onSuccess { server ->
        println("HTTP server started on port " + server.actualPort())
      }
  }

  private fun validateJson(schema: Schema, jsonObj: JsonObject): Boolean {
    try {
      schema.validateSync(jsonObj)
      return true
    } catch (e: ValidationException) {
      // Failed validation
    } catch (e: NoSyncValidationException) {
      // Cannot validate synchronously. You must validate using validateAsync
    }
    return false
  }
}
