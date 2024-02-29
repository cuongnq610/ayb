export default function getTimestampBlock(blockNumber: number, blockTimeInSecond?: number) {
  return blockNumber * (blockTimeInSecond || 2);
}
