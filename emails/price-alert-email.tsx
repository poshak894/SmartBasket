import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";

export function PriceAlertEmail({ productName, currentPrice, targetPrice }: { productName: string; currentPrice: number; targetPrice: number }) {
  return (
    <Html>
      <Head />
      <Preview>Your SmartBasket price alert just triggered.</Preview>
      <Body style={{ backgroundColor: "#F8F9FC", fontFamily: "Arial, sans-serif", padding: "24px" }}>
        <Container style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "32px" }}>
          <Heading>SmartBasket alert triggered</Heading>
          <Text>{productName} has dropped to ₹{currentPrice}, below your target of ₹{targetPrice}.</Text>
          <Section>
            <Button href="https://kartcompare.in/dashboard/alerts" style={{ backgroundColor: "#1A6BFF", color: "#FFFFFF", padding: "12px 18px", borderRadius: "12px" }}>
              View alert
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
