import { useForm, SubmitHandler } from "react-hook-form";
import React from 'react';
import axios from 'axios';
import './styles.css';

type Inputs = {
  emojiNum: number,
  betCents: number,
};

type Account = {
  username: string,
  balanceCents: number
}

function App() {
  const [account, setAccount] = React.useState<Account>({username: "blubb", balanceCents: 10000})
  const [emojis, setEmojis] = React.useState<Array<number>>([]);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

  const bet = (username: string, emojiNum: number, betCents: number) => {
    const data = { username, emojiNum, betCents };
    axios.post(apiUrl, {...data})
      .then((response) => {

        console.log(response);
        setEmojis(response.data.emojis);
      })
      .catch((error) => {
        console.log(error);
      });
    
  };

  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(data);
    const emojiNum = Number(data.emojiNum);
    const stake = Number(data.betCents);
    bet(account.username, emojiNum, stake);
  };

  const randomUnicodeCodePoints = (n: number) => {
    return Array.from({ length: n }, () => Math.floor(127500 + Math.random() * 2400));
  }

  // 𒓬 🌌 🎰🪆😀😀🧬🏴󠁧󠁢󠁥󠁮󠁧󠁿🫀 🃏🦖🦅🙬🗺🌐🕷🦤😱
  /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
  return (
    <div className="App">
      <h1>Emoji Casino</h1>
      <header className="App-header">
        <div>
          <label>Username</label>
          <span>{account.username}</span>
        </div>
       {/* <div>
          <button style={{ display: "inline" }} onClick={() => console.log("click")}>Insert money 💶</button>
          <button style={{ display: "inline" }}>Insert money 💶</button>
          <button style={{ display: "inline" }}>Insert money 💶</button>
       </div>*/}
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Emoji amount</label>
          <input defaultValue="100" {...register("emojiNum", {min: 1, max: 9999})} />

          {/*<input {...register("stake", { required: true })} />*/}
          <label>Stake</label>
          <select {...register("betCents", { required: true })}>
            <option value="20">20 cent</option>
            <option value="50">50 cent</option>
            <option selected value="100">1 euro</option>
          </select>
          {errors.betCents && <span>This field is required</span>}

          <input type="submit" />
        </form>
        <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', fontSize: '14px' }}>
          <p>
            {emojis.map((emoji, i) => (
              <span>{String.fromCodePoint(emoji)}</span>
            )
            )}
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
