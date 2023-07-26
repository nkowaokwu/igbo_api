import StatType from '../../shared/constants/StatType';

interface Stat {
  type: StatType;
  authorId: string;
  value: object;
}

export default Stat;
