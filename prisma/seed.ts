import { PrismaClient, Plan, EntityType, ProductType, Currency } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el sembrado de datos (Seed)...');

  // Limpiar base de datos para evitar duplicados
  await prisma.simulation.deleteMany();
  await prisma.financialRate.deleteMany();
  await prisma.financialEntity.deleteMany();
  await prisma.user.deleteMany();
  await prisma.glossaryTerm.deleteMany();

  // 1. Crear Usuario de Prueba Administrador/Demo
  const hashedPassword = await bcrypt.hash('Yupay2026!', 10);
  const demoUser = await prisma.user.create({
    data: {
      username: 'usuario_demo',
      email: 'demo@yupay.pe',
      password: hashedPassword,
      plan: Plan.ESTUDIANTE,
    },
  });
  console.log(`Usuario demo creado: ${demoUser.email}`);

  // 2. Crear Entidades Financieras
  const entidades = [
    {
      name: 'Banco Pichincha',
      logoUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=60',
      type: EntityType.BANCO,
    },
    {
      name: 'Caja Arequipa',
      logoUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=150&auto=format&fit=crop&q=60',
      type: EntityType.CAJA_MUNICIPAL,
    },
    {
      name: 'Caja Huancayo',
      logoUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=150&auto=format&fit=crop&q=60',
      type: EntityType.CAJA_MUNICIPAL,
    },
    {
      name: 'Financiera Oh!',
      logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=60',
      type: EntityType.FINANCIERA,
    },
    {
      name: 'Banco Falabella',
      logoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=150&auto=format&fit=crop&q=60',
      type: EntityType.BANCO,
    },
    {
      name: 'Caja Piura',
      logoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=150&auto=format&fit=crop&q=60',
      type: EntityType.CAJA_MUNICIPAL,
    },
  ];

  const dbEntidades: Record<string, any> = {};
  for (const ent of entidades) {
    const created = await prisma.financialEntity.create({ data: ent });
    dbEntidades[ent.name] = created;
    console.log(`Entidad creada: ${created.name}`);
  }

  // 3. Crear Tasas Financieras (TREA/TEA)
  const tasas = [
    // Banco Pichincha
    {
      entityId: dbEntidades['Banco Pichincha'].id,
      rateValue: 0.0525, // 5.25%
      productType: ProductType.PLAZO_FIJO,
      currency: Currency.PEN,
      minTerm: 360,
      region: 'Lima',
    },
    {
      entityId: dbEntidades['Banco Pichincha'].id,
      rateValue: 0.0500, // 5.0%
      productType: ProductType.PLAZO_FIJO,
      currency: Currency.PEN,
      minTerm: 180,
      region: 'Todo el Perú',
    },
    // Caja Arequipa
    {
      entityId: dbEntidades['Caja Arequipa'].id,
      rateValue: 0.0600, // 6.0%
      productType: ProductType.PLAZO_FIJO,
      currency: Currency.PEN,
      minTerm: 360,
      region: 'Arequipa',
    },
    {
      entityId: dbEntidades['Caja Arequipa'].id,
      rateValue: 0.0550, // 5.5%
      productType: ProductType.PLAZO_FIJO,
      currency: Currency.PEN,
      minTerm: 180,
      region: 'Todo el Perú',
    },
    // Caja Huancayo
    {
      entityId: dbEntidades['Caja Huancayo'].id,
      rateValue: 0.0575, // 5.75%
      productType: ProductType.PLAZO_FIJO,
      currency: Currency.PEN,
      minTerm: 360,
      region: 'Junin',
    },
    {
      entityId: dbEntidades['Caja Huancayo'].id,
      rateValue: 0.0350, // 3.5%
      productType: ProductType.AHORRO,
      currency: Currency.PEN,
      minTerm: 1,
      region: 'Todo el Perú',
    },
    // Financiera Oh!
    {
      entityId: dbEntidades['Financiera Oh!'].id,
      rateValue: 0.0625, // 6.25%
      productType: ProductType.PLAZO_FIJO,
      currency: Currency.PEN,
      minTerm: 360,
      region: 'Lima',
    },
    {
      entityId: dbEntidades['Financiera Oh!'].id,
      rateValue: 0.0150, // 1.5%
      productType: ProductType.PLAZO_FIJO,
      currency: Currency.USD,
      minTerm: 360,
      region: 'Todo el Perú',
    },
    // Banco Falabella
    {
      entityId: dbEntidades['Banco Falabella'].id,
      rateValue: 0.0450, // 4.5%
      productType: ProductType.AHORRO,
      currency: Currency.PEN,
      minTerm: 1,
      region: 'Todo el Perú',
    },
    // Caja Piura
    {
      entityId: dbEntidades['Caja Piura'].id,
      rateValue: 0.0585, // 5.85%
      productType: ProductType.PLAZO_FIJO,
      currency: Currency.PEN,
      minTerm: 360,
      region: 'Piura',
    },
  ];

  for (const t of tasas) {
    await prisma.financialRate.create({ data: t });
  }
  console.log(`Creadas ${tasas.length} tasas financieras para la simulación.`);

  // 4. Crear Glosario Educativo Financiero
  const terminos = [
    {
      term: 'TEA (Tasa Efectiva Anual)',
      simpleDefinition: 'Es el costo total que pagas por año al pedir un préstamo, o la ganancia que recibes si depositas dinero. Incluye el interés puro capitalizado.',
      category: 'Tasas',
    },
    {
      term: 'TREA (Tasa Rendimiento Efectiva Anual)',
      simpleDefinition: 'Es el rendimiento real neto de tus ahorros por año. Se calcula restándole a la TEA las comisiones y gastos adicionales de la cuenta.',
      category: 'Tasas',
    },
    {
      term: 'FSD (Fondo de Seguro de Depósitos)',
      simpleDefinition: 'Un fondo regulado en el Perú que protege tus ahorros gratis si un banco o caja quiebra. Cubre actualmente hasta un monto aproximado de S/ 120,000.',
      category: 'Seguridad',
    },
    {
      term: 'Plazo Fijo',
      simpleDefinition: 'Una forma de ahorro donde te comprometes a dejar tu dinero por un tiempo acordado (ej: 180 o 360 días) a cambio de una tasa de interés más alta.',
      category: 'Ahorro',
    },
    {
      term: 'Inflación',
      simpleDefinition: 'Es el aumento generalizado de los precios en el mercado. Si hay alta inflación, tu dinero pierde poder de compra, por lo que debes buscar tasas mayores.',
      category: 'Economía',
    },
  ];

  for (const term of terminos) {
    await prisma.glossaryTerm.create({ data: term });
  }
  console.log(`Creados ${terminos.length} términos de educación financiera.`);

  console.log('Sembrado de datos finalizado con éxito.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
