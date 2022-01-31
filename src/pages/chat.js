import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../../config.json";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../components/ButtonSendSticker';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../environments/supaBase';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function listenNewMessages(addMessage) {
  supabaseClient
    .from("mensagens")
    .on("INSERT", ( newMessage ) => {
      addMessage(newMessage);
    })
    .subscribe();
}

export default function ChatPage() {

  const router = useRouter();
  const userLoggedIn = router.query.username;

  const [message, setMessage] = React.useState("");
  const [listMessages, setListMessages] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
    .from('mensagens')
    .select('*')
    .order('id', { ascending: false})
    .then(({ data }) => {
      setListMessages(data);
    })

    listenNewMessages((newMessage) => {
        setListMessages((currentValue) => {
          return [
            newMessage.new,
            ...currentValue
          ]
        })  
      });
    }, []);
  
  function handleNewMessage(newMessage) {
    const message = {
      message: newMessage,
      by: userLoggedIn,
      id: listMessages.length + 1,
    };
    
    // setListMessages([
    //    message,
    //     ...listMessages
    //   ]
    // ) 
    setMessageDb(message)
    setMessage("");
  }

  function setMessageDb(message) {
    supabaseClient
    .from("mensagens")
    .insert([
      message
    ])
    .then(() => {

    })
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header username={userLoggedIn} />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList messages={listMessages} />
          {/* <MessageList mensagens={[]} /> */}
          {/* {listaMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.mensagem}
                            </li>
                        )
                    })} */}
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
            value={message}
              onChange={(event) => {
                const value = event.target.value;
                setMessage(value);
              }}
              onKeyPress={(event) => {
                if (event.key == "Enter") {
                  event.preventDefault();
                  handleNewMessage(message);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNewMessage(":sticker:" + sticker)
              }}
            />
            <Button
                styleSheet={{
                  minWidth: "50px",
                  minHeight: "50px",
                  marginLeft: "6px",
                  top: "-3px"
                }}
                iconName="arrowRight"
                fullWidth
                buttonColors={{
                  contrastColor: appConfig.theme.colors.neutrals["000"],
                  mainColor: appConfig.theme.colors.primary[500],
                  mainColorLight: appConfig.theme.colors.primary[400],
                  mainColorStrong: appConfig.theme.colors.primary[600],
                }}
                onClick={(event) => {
                    if(message.length > 0) {
                        handleNewMessage(message)
                    }
                }}
            >
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header(props) {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Image
                styleSheet={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${props.username}.png`}
        />
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.messages.map((message) => {
        return (
          <Text
            key={message.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${message.by}.png`}
              />
              <Text tag="strong">{message.by}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
            {message.message.startsWith(":sticker:") ? (
              <Image src={message.message.replace(":sticker:", "")}/>
            )
            : (
              message.message
            )}
          </Text>
        );
      })}
    </Box>
  );
}
