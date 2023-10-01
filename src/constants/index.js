


export const dummyMessages = [
    {
        _id: new Date().getTime() + 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          
        },
      },
      {
        _id: new Date().getTime() + 2,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          
        },
      },
      {
        _id: new Date().getTime() + 3,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          
        },
      },
      {
        _id: new Date().getTime() + 18,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          
        },
      },
      {
        _id: new Date().getTime() + 56,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          
        },
      },
      {
        _id: new Date().getTime() + 23,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          
        },
      },
      {
        _id: new Date().getTime() + 4,
        text: 'probando',
        createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
        system: true,
        // Any additional custom parameters are passed through
      },
      {
        _id: new Date().getTime() + 5,
        text: 'My message',
        createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
        user: {
          _id: 2,
         
          
        },
        image: 'https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg',
       
        sent: true,
        // Mark the message as received, using two tick
        received: true,
        // Mark the message as pending with a clock loader
        pending: true,
        // Any additional custom parameters are passed through
      },
]