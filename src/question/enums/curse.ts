export enum Curse {
  CMS = 'cms',
  PLC = 'plc',
  PLP = 'plp',
  INV = 'inv',
  PLA = 'pla',
}

export const CurseDescription = {
  [Curse.CMS]: 'Comissário de Voo',
  [Curse.PLC]: 'Piloto Comercial',
  [Curse.PLP]: 'Piloto Privado',
  [Curse.INV]: 'Instrutor de Voo',
  [Curse.PLA]: 'Piloto de Linha Aérea',
};
