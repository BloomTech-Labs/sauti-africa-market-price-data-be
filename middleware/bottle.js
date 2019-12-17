import Bottleneck from "bottleneck";

const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 100
});

const fetchUser = id => {
    return
}

limiter.schedule(() => myFunction(arg1, arg2))
    .then((result) => {

    });

const result = await limiter.schedule(() => myFunction(arg1, arg2));