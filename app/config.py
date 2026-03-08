from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_TITLE: str = "BizScorer"
    DATABASE_URL: str = "sqlite:///./bizscorer.db"
    DEBUG: bool = True

    WEIGHT_FINANCIAL_HEALTH: float = 0.30
    WEIGHT_ONLINE_PRESENCE: float = 0.15
    WEIGHT_CUSTOMER_SATISFACTION: float = 0.25
    WEIGHT_OPERATIONAL_EFFICIENCY: float = 0.20
    WEIGHT_COMPLIANCE: float = 0.10

    @property
    def scoring_weights(self) -> dict[str, float]:
        return {
            "financial_health": self.WEIGHT_FINANCIAL_HEALTH,
            "online_presence": self.WEIGHT_ONLINE_PRESENCE,
            "customer_satisfaction": self.WEIGHT_CUSTOMER_SATISFACTION,
            "operational_efficiency": self.WEIGHT_OPERATIONAL_EFFICIENCY,
            "compliance": self.WEIGHT_COMPLIANCE,
        }


settings = Settings()
