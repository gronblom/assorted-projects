package com.example.kotlinbackendtest

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.annotation.Id
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.relational.core.mapping.Table
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.*
import java.util.stream.Collectors
import javax.servlet.http.HttpServletRequest

@SpringBootApplication
class KotlinBackendTestApplication

@Table("actor")
data class Actor(@Id val actor_id: Integer?, val first_name: String, val last_name: String, val last_update: String?)

@RestController
@RequestMapping("/actors")
class ActorResource(val service: ActorService) {
	@GetMapping(produces = ["application/json"])
	fun index(): List<Actor> = service.findActors()

	@GetMapping(value = ["/{id}"], produces = ["application/json"])
	fun getCustomer(@PathVariable("id") id: Long): Actor? {
		return service.findActor(id)
	}

	@PostMapping
	fun post(@RequestBody actor: Actor) {
		service.post(actor)
	}
}

interface ActorRepository : CrudRepository<Actor, String> {

	@Query("select * from actor")
	fun findActors(): List<Actor>

	@Query("select * from actor where actor_id = :id")
	fun findActor(id: Long): Actor

}

@Service
class ActorService(val db: ActorRepository) {

	fun findActors(): List<Actor> = db.findActors()

	fun findActor(id: Long): Actor = db.findActor(id)

	fun post(actor: Actor){
		db.save(actor)
	}
}

@Table("film")
data class Film(@Id val film_id: Integer?, val title: String, val description: String, val release_year: Int,
				val language_id: Int, val rental_duration: Int, val rental_rate: Int, val length: Int,
				val replacement_cost: Int, val rating: String, val last_update: String,
				val special_features: List<String>)

@RestController
@RequestMapping("/films")
class FilmResource(val service: FilmService) {
	companion object {
		lateinit var mapper: ObjectMapper
	}

	init {
		mapper = jacksonObjectMapper()
	}

	@GetMapping(produces = ["application/json"])
	fun index(): List<Film> = service.findFilms()

	@GetMapping(value = ["/{id}"], produces = ["application/json"])
	fun findFilms(@PathVariable("id") id: Long): Film? {
		return service.findFilm(id)
	}

	@PostMapping(value = ["/search"], consumes = ["application/json"], produces = ["application/json"])
	fun searchFilms(request: HttpServletRequest): List<Film?>? {
		val payload = request.reader.lines().collect(Collectors.joining(System.lineSeparator()));
		val jsonPayload = mapper.readTree(payload)
		val searchTerms = jsonPayload.get("searchTerms").asText()
		return service.searchFilms(searchTerms)
	}

	@PostMapping
	fun post(@RequestBody film: Film) {
		service.post(film)
	}

}

interface FilmRepository : CrudRepository<Film, String> {

	@Query("select * from film")
	fun findFilms(): List<Film>

	@Query("select * from film where film_id = :id")
	fun findFilm(id: Long): Film

	@Query("SELECT * FROM film WHERE fulltext @@ to_tsquery(:searchText)")
	fun searchFilms(searchText: String): List<Film?>?

}

@Service
class FilmService(val db: FilmRepository) {

	fun findFilms(): List<Film> = db.findFilms()

	fun findFilm(id: Long): Film = db.findFilm(id)

	fun searchFilms(searchText: String): List<Film?>? = db.searchFilms(searchText)

	fun post(film: Film){
		db.save(film)
	}
}

fun main(args: Array<String>) {
	runApplication<KotlinBackendTestApplication>(*args)
}
