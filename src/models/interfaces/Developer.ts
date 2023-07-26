interface Developer {
  name: string;
  apiKey: string;
  email: string;
  password: string;
  usage: {
    date: Date;
    count: number;
  };
}

export default Developer;
