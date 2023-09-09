import React, {useState , useEffect} from 'react'
import axios from 'axios';
import {server} from "../index"
import ErrorComponent from './ErrorComponent';
import { Container , HStack , Button , Radio , RadioGroup} from '@chakra-ui/react';
import Loader from './Loader';
import CoinCard from './CoinCard';

const Coins = () => {

  const [coins, setCoins] = useState([]);
  const [loading , setLoading] = useState(true);
  const [error , setError] = useState(false);
  const [page , setPage ] = useState(1);
  const [currency , setCurrency ] = useState("inr");

  const currencySymbol = currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  //function define
  const changePage = (page) => {
      setPage(page);
      setLoading(true);
  }

  // make buttons for page change
  const btns = new Array(132).fill(1);

  useEffect(() => {
    const fetchCoins = async() => {
      try {
        const { data } = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`)

        setCoins(data);
        setLoading(false);

      } catch (error) {
        setError(true);
        setLoading(false);

      }
    }
  
    fetchCoins();
  } , [currency , page])

  if(error) return <ErrorComponent message={"Error While Fetching Coins"}/>

  return (
    <Container maxW={"container.xl"}>

       {
            loading ? <Loader /> 
            
            : <>

               <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
                    <HStack spacing={"4"}>
                        <Radio value={"inr"}> INR </Radio>
                        <Radio value={"usd"}> USD </Radio>
                        <Radio value={"eur"}> EUR </Radio>
                    </HStack>
               </RadioGroup>
               
                <HStack wrap={"wrap"} justifyContent={"space-evenly"}>

                    {
                        coins.map((i) => (
                            <CoinCard key={i.id} id={i.id} name={i.name} price={i.current_price} img={i.image} symbol={i.symbol} currencySymbol={currencySymbol}/>
                        ))
                    }

                </HStack>

                <HStack w={"full"} overflowX={"auto"} p={"8"}>
                    {
                      btns.map((item , index) => (
                        <Button key={index} bgColor={"blackAlpha.900"} color={"white"} onClick={() => changePage(index + 1)}> {index + 1} </Button>
                      ))
                    }

                </HStack>

            </>
       }

    </Container>
  )
}

export default Coins