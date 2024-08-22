export enum Subject {
  EME = 'eme',
  SBV = 'sbv',
  FHU = 'fhu',
  SAC = 'sac',
  RAC = 'rac',
  RPA = 'rpa',
  SVO = 'svo',
  AFI = 'afi',
  PSS = 'pss',
  AER = 'aer',
  NAV = 'nav',
  MET = 'met',
}

export const SubjectDescription = {
  [Subject.EME]: 'Emergências a Bordo',
  [Subject.SBV]: 'Sobrevivência',
  [Subject.FHU]: 'Fatores Humanos na Aviação',
  [Subject.SAC]: 'Sistema de Aviação Civil',
  [Subject.RAC]: 'Regulamentação da Aviação Civil',
  [Subject.RPA]: 'Regulamentação da Profissão do Aeronauca',
  [Subject.SVO]: 'Segurança de Voo',
  [Subject.AFI]: 'Aspectos Fisiológicos',
  [Subject.PSS]: 'Primeiros Socorros',
  [Subject.AER]: 'Conhecimentos Básicos sobre Aeronave',
  [Subject.NAV]: 'Navegação Aérea',
  [Subject.MET]: 'Meteorologia',
};
