import React, { useState, useEffect } from "react";
import { Container, VStack, HStack, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Box, Heading } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const generateSignalData = (frequency, amplitude, phase, length = 1000) => {
  const data = [];
  for (let i = 0; i < length; i++) {
    const t = i / length;
    data.push(amplitude * Math.sin(2 * Math.PI * frequency * t + phase));
  }
  return data;
};

const Index = () => {
  const [gbaud, setGbaud] = useState(1);
  const [gbps, setGbps] = useState(1);
  const [lo, setLo] = useState(1);

  const [binarySignal, setBinarySignal] = useState([]);
  const [basebandSignal, setBasebandSignal] = useState([]);
  const [rfSignal, setRfSignal] = useState([]);
  const [ifSignal, setIfSignal] = useState([]);
  const [loSignal, setLoSignal] = useState([]);

  useEffect(() => {
    setBinarySignal(generateSignalData(gbaud, 1, 0));
    setBasebandSignal(generateSignalData(gbps, 1, 0));
    setRfSignal(generateSignalData(gbps + lo, 1, 0));
    setIfSignal(generateSignalData(gbps - lo, 1, 0));
    setLoSignal(generateSignalData(lo, 1, 0));
  }, [gbaud, gbps, lo]);

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
    },
  };

  const createChartData = (label, data) => ({
    labels: Array.from({ length: data.length }, (_, i) => i),
    datasets: [
      {
        label,
        data,
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  });

  return (
    <Container centerContent maxW="container.xl" py={10}>
      <VStack spacing={8} width="100%">
        <Heading as="h1" size="xl">
          Signal Visualizer
        </Heading>
        <HStack width="100%" spacing={8}>
          <Box width="30%">
            <Text>Gbaud: {gbaud}</Text>
            <Slider defaultValue={1} min={1} max={10} step={0.1} onChange={(val) => setGbaud(val)}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
          <Box width="30%">
            <Text>Gbps: {gbps}</Text>
            <Slider defaultValue={1} min={1} max={10} step={0.1} onChange={(val) => setGbps(val)}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
          <Box width="30%">
            <Text>LO: {lo}</Text>
            <Slider defaultValue={1} min={1} max={10} step={0.1} onChange={(val) => setLo(val)}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        </HStack>
        <VStack width="100%" spacing={8}>
          <Box width="100%">
            <Text>Binary Signal</Text>
            <Line data={createChartData("Binary Signal", binarySignal)} options={chartOptions} />
          </Box>
          <Box width="100%">
            <Text>Baseband Signal</Text>
            <Line data={createChartData("Baseband Signal", basebandSignal)} options={chartOptions} />
          </Box>
          <Box width="100%">
            <Text>RF Signal</Text>
            <Line data={createChartData("RF Signal", rfSignal)} options={chartOptions} />
          </Box>
          <Box width="100%">
            <Text>IF Signal</Text>
            <Line data={createChartData("IF Signal", ifSignal)} options={chartOptions} />
          </Box>
          <Box width="100%">
            <Text>LO Signal</Text>
            <Line data={createChartData("LO Signal", loSignal)} options={chartOptions} />
          </Box>
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;
