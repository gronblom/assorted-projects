import { Difficulty, Question, QuestionType } from "../graphql/generated";

const questions: Question[] = [
    {
        "category": "Entertainment: Japanese Anime & Manga",
        "type": QuestionType.Boolean,
        "difficulty": Difficulty.Easy,
        "question": "Clefairy was intended to be Ash&#039;s starting Pok&eacute;mon in the pilot episode of the cartoon.",
        "correct_answer": "True",
        "incorrect_answers": [
            "False"
        ]
    },
    {
        "category": "Entertainment: Music",
        "type": QuestionType.MultipleChoice,
        "difficulty": Difficulty.Easy,
        "question": "How many studio albums have the duo Daft Punk released?",
        "correct_answer": "4",
        "incorrect_answers": [
            "1",
            "5",
            "2"
        ]
    },
    {
        "category": "Sports",
        "type": QuestionType.MultipleChoice,
        "difficulty": Difficulty.Easy,
        "question": "Who won the 2015 Formula 1 World Championship?",
        "correct_answer": "Lewis Hamilton",
        "incorrect_answers": [
            "Nico Rosberg",
            "Sebastian Vettel",
            "Jenson Button"
        ]
    },
    {
        "category": "Geography",
        "type": QuestionType.MultipleChoice,
        "difficulty": Difficulty.Easy,
        "question": "What country has a horizontal bicolor red and white flag?",
        "correct_answer": "Monaco",
        "incorrect_answers": [
            "Bahrain",
            "Malta",
            "Liechenstein"
        ]
    },
    {
        "category": "Entertainment: Television",
        "type": QuestionType.MultipleChoice,
        "difficulty": Difficulty.Easy,
        "question": "How many seasons did &quot;Stargate SG-1&quot; have?",
        "correct_answer": "10",
        "incorrect_answers": [
            "3",
            "7",
            "12"
        ]
    },
    {
        "category": "Entertainment: Video Games",
        "type": QuestionType.MultipleChoice,
        "difficulty": Difficulty.Medium,
        "question": "In the game Destiny, who succeeded Peter Dinklage in voicing the protagonist&#039;s &quot;Ghost&quot;?",
        "correct_answer": "Nolan North",
        "incorrect_answers": [
            "John DiMaggio",
            "Mark Hamill",
            " Troy Baker"
        ]
    },
    {
        "category": "Sports",
        "type": QuestionType.MultipleChoice,
        "difficulty": Difficulty.Hard,
        "question": "Which male player won the gold medal of table tennis singles in 2016 Olympics Games?",
        "correct_answer": "Ma Long (China)",
        "incorrect_answers": [
            "Zhang Jike (China)",
            "Jun Mizutani (Japan)",
            "Vladimir Samsonov (Belarus)"
        ]
    },
    {
        "category": "Celebrities",
        "type": QuestionType.MultipleChoice,
        "difficulty": Difficulty.Medium,
        "question": "Where was Kanye West born?",
        "correct_answer": "Atlanta, Georgia",
        "incorrect_answers": [
            "Chicago, Illinois",
            "Los Angeles, California",
            "Detroit, Michigan"
        ]
    },
    {
        "category": "History",
        "type": QuestionType.MultipleChoice,
        "difficulty": Difficulty.Medium,
        "question": "When did the British hand-over sovereignty of Hong Kong back to China?",
        "correct_answer": "1997",
        "incorrect_answers": [
            "1999",
            "1841",
            "1900"
        ]
    },
    {
        "category": "Entertainment: Television",
        "type": QuestionType.MultipleChoice,
        "difficulty": Difficulty.Easy,
        "question": "What is the name of the planet that the Doctor from television series &quot;Doctor Who&quot; comes from?",
        "correct_answer": "Gallifrey",
        "incorrect_answers": [
            "Sontar",
            "Skaro",
            "Mondas"
        ]
    },
    {
        "category": "Politics",
        "type": QuestionType.MultipleChoice,
        "difficulty": Difficulty.Easy,
        "question": "Former United States President Bill Clinton famously played which instrument?",
        "correct_answer": "Saxophone",
        "incorrect_answers": [
            "Baritone horn",
            "Piano",
            "Violin"
        ]
    },
    {
        "category": "Entertainment: Video Games",
        "type": QuestionType.Boolean,
        "difficulty": Difficulty.Medium,
        "question": "The Fiat Multipla is a drivable car in &quot;Forza Horizon 3&quot;.",
        "correct_answer": "False",
        "incorrect_answers": [
            "True"
        ]
    },
    {
        "category": "General Knowledge",
        "type": QuestionType.MultipleChoice,
        "difficulty": Difficulty.Hard,
        "question": "If you planted the seeds of Quercus robur, what would grow?",
        "correct_answer": "Trees",
        "incorrect_answers": [
            "Grains",
            "Vegetables",
            "Flowers"
        ]
    },
    {
        "category": "Entertainment: Video Games",
        "type": QuestionType.MultipleChoice,
        "difficulty": Difficulty.Easy,
        "question": "Which Final Fantasy game consisted of a female-only cast of party members?",
        "correct_answer": "Final Fantasy X-2",
        "incorrect_answers": [
            "Final Fantasy IX",
            "Final Fantasy V",
            "Final Fantasy XIII-2"
        ]
    }
];

export default questions;