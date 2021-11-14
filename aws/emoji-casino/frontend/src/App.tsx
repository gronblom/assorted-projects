import { useForm, SubmitHandler } from "react-hook-form";
import React from 'react';
import axios from 'axios';
import './styles.css';
import { StringMappingType } from "typescript";

type Inputs = {
  emojiNum: number,
  betCents: number,
};

type Account = {
  name: string,
  username: string,
  balanceCents: number
}

function App() {
  const [account, setAccount] = React.useState<Account>({name: "Emoji-Casino User", username: "emoji_casino_user", balanceCents: 10000})
  const [emojis, setEmojis] = React.useState<Array<number>>([]);
  const [lastWinCents, setLastWinCents] = React.useState<number | undefined>(undefined);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

  const bet = (username: string, emojiNum: number, betCents: number) => {
    const data = { username, emojiNum, betCents };
    axios.post(apiUrl, {...data})
      .then((response) => {
        console.log(response);
        const newBalanceCents = account.balanceCents - response.data.betCents + response.data.winAmountCents;
    setAccount({...account, balanceCents: newBalanceCents});
        setLastWinCents(response.data.winAmountCents);
        setEmojis(response.data.emojis);
      })
      .catch((error) => {
        console.log(error);
      });
    
  };

  const insertMoney = () => {
    setAccount({...account, balanceCents: account.balanceCents + 10000});
  }

  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(data);
    const emojiNum = Number(data.emojiNum);
    const betCents = Number(data.betCents);
    bet(account.username, emojiNum, betCents);
  };

  const formatCents = (cents: number | undefined): string => {
    if (!cents && cents != 0) {
      return "";
    }
    const euros = cents / 100;
    const centsRemainder = cents % 100;
    return `${euros}.${String(centsRemainder).padStart(2, '0')}`
  }

  // 𒓬 🌌 🎰🪆😀😀🧬🏴󠁧󠁢󠁥󠁮󠁧󠁿🫀 🃏🦖🦅🙬🗺🌐🕷🦤😱
  /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
  return (
    <div className="App">
      <h1>Emoji Casino</h1>
      <header className="App-header">
        <p>
        <div style={{ display: "inline", margin: "50px"}}>
          <button onClick={() => insertMoney()} style={{ display: "inline" }}>Insert money 💶</button>
          <label style={{ display: "inline", margin: "20px"}}>Balance: {formatCents(account.balanceCents)}</label>
          <label style={{ display: "inline", margin: "20px"}}>Last win: {formatCents(lastWinCents)}</label>
        </div>
        </p>
       {/* <div>
          <button style={{ display: "inline" }} onClick={() => console.log("click")}>Insert money 💶</button>
          <button style={{ display: "inline" }}>Insert money 💶</button>
       </div>*/}
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Emoji amount</label>
          <input defaultValue="499" {...register("emojiNum", {min: 1, max: 9999})} />
          {errors.emojiNum && <span>Emoji amount has to be between 1 and 9999</span>}
          {/*<input {...register("stake", { required: true })} />*/}
          <label>Stake</label>
          <select {...register("betCents", { required: true })}>
            <option value="20">20 cent</option>
            <option value="50">50 cent</option>
            <option selected value="100">1 euro</option>
          </select>
          

          <input type="submit" />
        </form>
        <div>

        </div>
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
