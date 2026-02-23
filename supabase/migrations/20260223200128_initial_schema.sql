CREATE TABLE public.vagas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  servico TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  disponibilidade TEXT NOT NULL,
  requisitos TEXT NOT NULL,
  data_servico DATE NOT NULL,
  treinamento BOOLEAN NOT NULL DEFAULT false,
  contato TEXT NOT NULL,
  tipo TEXT NOT NULL,
  cep_base TEXT,
  raio_distancia INTEGER,
  perguntas JSONB DEFAULT '{"equipmentQuestion": "", "customQuestions": []}'::jsonb,
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.talentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  equipamento_tipo TEXT NOT NULL,
  equipamento_modelo TEXT NOT NULL,
  cep TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  distancia INTEGER NOT NULL,
  disponibilidade TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.convites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE CASCADE,
  talento_id UUID REFERENCES public.talentos(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Pendente',
  link_unico TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Talentos
INSERT INTO public.talentos (nome, equipamento_tipo, equipamento_modelo, cidade, estado, disponibilidade, cep, distancia, tipo, avatar_url) VALUES
('Ana Silva', 'Notebook', 'MacBook Air M1', 'São Paulo', 'SP', 'Integral', '01310-100', 12, 'Home Office', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=10'),
('Carlos Oliveira', 'Celular', 'iPhone 13', 'São Paulo', 'SP', 'Tardes', '04538-132', 5, 'Presencial', 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=11'),
('Mariana Costa', 'Notebook', 'Dell XPS 15', 'Rio de Janeiro', 'RJ', 'Integral', '20040-002', 400, 'Home Office', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=12'),
('Pedro Santos', 'Celular', 'Galaxy S22', 'Campinas', 'SP', 'Manhãs', '13010-000', 90, 'Presencial', 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=13'),
('Juliana Mendes', 'Notebook', 'Lenovo ThinkPad T14', 'Belo Horizonte', 'MG', 'Integral', '30110-000', 500, 'Home Office', 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=14'),
('Rafael Lima', 'Celular', 'Motorola Edge 30', 'Curitiba', 'PR', 'Flexível', '80020-000', 8, 'Presencial', 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=15');

-- Seed Vagas
INSERT INTO public.vagas (titulo, servico, valor, tipo, data_servico, status, disponibilidade, requisitos, treinamento, contato, cep_base, raio_distancia, perguntas) VALUES
('Consultoria de Infraestrutura', 'Arquitetura Cloud', 12500, 'Home Office', '2024-03-15', 'Ativo', 'Integral (Segunda a Sexta)', '• Experiência comprovada em AWS e Azure\n• Conhecimento avançado em Terraform e Kubernetes\n• Inglês fluente para conversação\n• Certificação AWS Solutions Architect é um diferencial.', true, 'tech.recruiting@empresa.com', NULL, NULL, '{"equipmentQuestion": "Qual modelo de notebook/computador você possui?", "customQuestions": [{"question": "Possui alguma certificação cloud ativa? Qual?"}, {"question": "Qual foi o maior desafio de infraestrutura que você já resolveu?"}]}'),
('Desenvolvimento de MVP', 'Engenharia de Software', 25000, 'Home Office', '2024-04-01', 'Ativo', 'Flexível', '• Domínio de React, Node.js e TypeScript\n• Experiência prévia na construção de produtos do zero\n• Conhecimento em banco de dados relacionais e NoSQL\n• Foco em entrega de valor e agilidade.', false, 'produto@startup.io', NULL, NULL, '{"equipmentQuestion": "Qual modelo de notebook/computador você possui?", "customQuestions": [{"question": "Compartilhe o link do seu GitHub ou portfólio."}]}'),
('Design de Interface App', 'UX/UI Design', 8000, 'Presencial', '2024-03-20', 'Inativo', 'Parcial (Tardes)', '• Portfólio focado em aplicativos mobile (iOS e Android)\n• Domínio do Figma e criação de Design Systems\n• Boa capacidade de comunicação com desenvolvedores\n• Residir na região metropolitana.', true, 'design.team@agencia.com', '01310-100', 15, '{"equipmentQuestion": "Qual modelo de celular você possui?", "customQuestions": [{"question": "Você tem experiência com testes de usabilidade?"}]}');

-- Seed Admin User
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  email_change_token_current, phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'admin@example.com',
  crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
  '{"provider": "email", "providers": ["email"]}', '{"name": "Admin"}', false, 'authenticated', 'authenticated',
  '', '', '', '', '', '', '', '', ''
);
