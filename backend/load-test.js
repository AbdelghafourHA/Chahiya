import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "20s", target: 30 },
    { duration: "30s", target: 80 },
    { duration: "30s", target: 80 },
    { duration: "10s", target: 0 },
  ],
};

export default function () {
  const timestamp = Date.now();
  const vuId = __VU;
  const iteration = __ITER;

  const orderData = JSON.stringify({
    customer: {
      fullName: `Test ${vuId}_${timestamp}_${iteration}`,
      phone: `055${vuId}${timestamp}${iteration}`.slice(0, 14),
    },
    items: [
      {
        _id: `test-${vuId}`,
        name: "بيتزا اختبار",
        price: 1000,
        category: "pizza",
        quantity: 1,
      },
    ],
    shippingPlace: "وسط المدينة",
    shippingPrice: 200,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = http.post("http://localhost:5000/api/orders", orderData, params);

  check(res, {
    "✅ status 201": (r) => r.status === 201,
    "✅ response time < 2s": (r) => r.timings.duration < 2000,
  });

  sleep(0.3);
}
